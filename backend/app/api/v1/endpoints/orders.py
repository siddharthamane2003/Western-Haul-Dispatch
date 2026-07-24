from typing import Optional, Any
from fastapi import APIRouter, Depends, Query, HTTPException, Request
from datetime import date
from fastapi import Request


def log_request(request: Request, body: Any):
    try:
        method = request.method
        url = str(request.url)
        headers = {k: v for k, v in request.headers.items() if k.lower() != "authorization"}
        print("--- Incoming Request ---")
        print(f"Method: {method}")
        print(f"URL: {url}")
        print(f"Headers: {headers}")
        print(f"Body: {body}")
        print("------------------------")
    except Exception as e:
        print(f"Failed to log request: {e}")
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_user, get_dispatcher_or_admin
from app.models import User
from app.services.dispatch_service import FreightOrderService, DispatchService
from app.repositories.repositories import FreightOrderRepository, DispatchRepository
from app.schemas.dispatch import (
    FreightOrderCreate, FreightOrderUpdate, FreightOrderResponse,
    DispatchCreate, DispatchUpdate, DispatchResponse, PaginatedResponse,
    TrackingUpdateCreate, OrderLocationCreate
)

order_router = APIRouter(prefix="/orders", tags=["Freight Orders"])
dispatch_router = APIRouter(prefix="/dispatches", tags=["Dispatches"])


# ─────────────────────────────────────────────
# FREIGHT ORDERS
# ─────────────────────────────────────────────

@order_router.post("/", response_model=FreightOrderResponse, status_code=201)
async def create_order(
    request: Request,
    order_in: FreightOrderCreate,
    current_user: User = Depends(get_dispatcher_or_admin),
    db: AsyncSession = Depends(get_db),

):
    """Create a new freight order with locations."""
    # Log incoming request for debugging
    try:
        log_request(request, order_in.model_dump())
    except Exception as e:
        print(f"Logging failed: {e}")

    service = FreightOrderService(db)
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User must belong to a company")
    try:
        return await service.create_order(order_in, current_user.company_id, current_user.id)
    except Exception as exc:
        print(f"Error in create_order endpoint: {exc}")
        raise


@order_router.get("/", response_model=PaginatedResponse)
async def list_orders(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: Optional[str] = None,
    status: Optional[str] = None,
    customer_id: Optional[UUID] = None,
    priority: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    sort_by: str = "created_at",
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List freight orders with advanced filtering."""
    repo = FreightOrderRepository(db)
    company_id = current_user.company_id

    items, total = await repo.advanced_filter(
        company_id=company_id,
        status=status,
        customer_id=customer_id,
        date_from=date_from,
        date_to=date_to,
        query=q,
        skip=(page - 1) * size,
        limit=size,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    # Reload each order with relations so customer + order_locations are present
    orders_with_relations = []
    for item in items:
        full = await repo.get_with_relations(item.id)
        if full:
            orders_with_relations.append(full)

    return PaginatedResponse(
        items=[FreightOrderResponse.model_validate(i) for i in orders_with_relations],
        total=total, page=page, size=size, pages=(total + size - 1) // size,
    )


@order_router.get("/{order_id}", response_model=FreightOrderResponse)
async def get_order(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get an order with all relations."""
    repo = FreightOrderRepository(db)
    order = await repo.get_with_relations(order_id)
    if not order or order.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@order_router.put("/{order_id}", response_model=FreightOrderResponse)
async def update_order(
    order_id: UUID,
    order_in: FreightOrderUpdate,
    current_user: User = Depends(get_dispatcher_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update a freight order."""
    service = FreightOrderService(db)
    return await service.update_order(order_id, order_in, current_user.id)


@order_router.post("/{order_id}/cancel")
async def cancel_order(
    order_id: UUID,
    reason: str = Query(..., min_length=5),
    current_user: User = Depends(get_dispatcher_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Cancel a freight order."""
    service = FreightOrderService(db)
    order = await service.cancel_order(order_id, reason, current_user.id)
    return {"message": "Order cancelled", "order_number": order.order_number}


@order_router.post("/{order_id}/locations", response_model=FreightOrderResponse)
async def add_order_locations(
    order_id: UUID,
    locations: list[OrderLocationCreate],
    replace: bool = Query(False, description="If true, delete existing locations first"),
    current_user: User = Depends(get_dispatcher_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Add (or replace) locations for an existing freight order."""
    from app.models import OrderLocation
    from sqlalchemy import delete as sa_delete

    repo = FreightOrderRepository(db)
    order = await repo.get(order_id)
    if not order or order.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Order not found")

    if replace:
        # Delete all existing locations for this order
        await db.execute(sa_delete(OrderLocation).where(OrderLocation.order_id == order_id))
        # Debug: print incoming order data
        print("[DEBUG] Incoming FreightOrderCreate:", locations)
        # After creation, print the persisted order
        print("[DEBUG] Created FreightOrder:", order)
        # Also print the DB response after locations added
        print("[DEBUG] Order with relations:", await repo.get_with_relations(order_id))
        # TODO: Remove debug prints after testing

    for loc in locations:
        loc_data = loc.model_dump()
        loc_data["order_id"] = order_id
        db.add(OrderLocation(**loc_data))

    await db.flush()
    return await repo.get_with_relations(order_id)


@order_router.get("/{order_id}/locations")
async def list_order_locations(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all locations for a freight order."""
    from sqlalchemy import select
    from app.models import OrderLocation

    result = await db.execute(
        select(OrderLocation)
        .where(OrderLocation.order_id == order_id)
        .order_by(OrderLocation.sequence)
    )
    locs = result.scalars().all()
    from app.schemas.dispatch import OrderLocationResponse
    return [OrderLocationResponse.model_validate(l) for l in locs]



@order_router.delete("/{order_id}")
async def delete_order(
    order_id: UUID,
    current_user: User = Depends(get_dispatcher_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete (soft) a freight order."""
    repo = FreightOrderRepository(db)
    order = await repo.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    from app.models import OrderStatus
    if order.status not in [OrderStatus.PENDING, OrderStatus.CANCELLED]:
        raise HTTPException(status_code=400, detail="Only pending or cancelled orders can be deleted")
    await repo.delete(order_id)
    return {"message": "Order deleted"}


@order_router.get("/{order_id}/summary")
async def get_order_summary(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get order dispatch summary."""
    repo = FreightOrderRepository(db)
    order = await repo.get_with_relations(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {
        "order_number": order.order_number,
        "status": str(order.status),
        "customer_id": str(order.customer_id),
        "total_amount": float(order.total_amount),
        "pickup_date": str(order.pickup_date),
        "locations": [
            {"type": loc.location_type, "address": loc.address, "city": loc.city}
            for loc in order.order_locations
        ],
        "dispatches": len(order.dispatches),
        "qr_code_url": order.qr_code_url,
    }


# ─────────────────────────────────────────────
# DISPATCHES
# ─────────────────────────────────────────────

@dispatch_router.post("/", response_model=DispatchResponse, status_code=201)
async def create_dispatch(
    dispatch_in: DispatchCreate,
    current_user: User = Depends(get_dispatcher_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Assign driver and vehicle to order, creating a dispatch."""
    service = DispatchService(db)
    return await service.create_dispatch(dispatch_in, current_user.id)


@dispatch_router.get("/", response_model=PaginatedResponse)
async def list_dispatches(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    driver_id: Optional[UUID] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List dispatches."""
    repo = DispatchRepository(db)
    from app.models import Dispatch, FreightOrder
    from sqlalchemy import and_

    filters = []
    if status:
        filters.append(Dispatch.status == status)
    if driver_id:
        filters.append(Dispatch.driver_id == driver_id)

    total = await repo.count(filters=filters)
    items = await repo.get_all(skip=(page - 1) * size, limit=size, filters=filters or None)

    return PaginatedResponse(
        items=[DispatchResponse.model_validate(i) for i in items],
        total=total, page=page, size=size, pages=(total + size - 1) // size,
    )


@dispatch_router.get("/queue")
async def get_dispatch_queue(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get active dispatch queue."""
    repo = DispatchRepository(db)
    dispatches = await repo.get_dispatch_queue(current_user.company_id)
    return [DispatchResponse.model_validate(d) for d in dispatches]


@dispatch_router.get("/{dispatch_id}", response_model=DispatchResponse)
async def get_dispatch(
    dispatch_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get dispatch with full details."""
    repo = DispatchRepository(db)
    dispatch = await repo.get_with_relations(dispatch_id)
    if not dispatch:
        raise HTTPException(status_code=404, detail="Dispatch not found")
    return dispatch


@dispatch_router.patch("/{dispatch_id}/status")
async def update_dispatch_status(
    dispatch_id: UUID,
    new_status: str = Query(...),
    reason: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update dispatch status (dispatch, arrive, complete, cancel)."""
    service = DispatchService(db)
    return await service.update_dispatch_status(dispatch_id, new_status, reason, current_user.id)


@dispatch_router.post("/{dispatch_id}/tracking")
async def add_tracking_update(
    dispatch_id: UUID,
    tracking_in: TrackingUpdateCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add a GPS tracking update for a dispatch."""
    from app.models import TrackingUpdate
    update = TrackingUpdate(dispatch_id=dispatch_id, **tracking_in.model_dump())
    db.add(update)
    await db.flush()
    return {"message": "Tracking update recorded"}


@dispatch_router.get("/{dispatch_id}/tracking")
async def get_tracking_history(
    dispatch_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get full tracking history for a dispatch."""
    from sqlalchemy import select
    from app.models import TrackingUpdate
    result = await db.execute(
        select(TrackingUpdate)
        .where(TrackingUpdate.dispatch_id == dispatch_id)
        .order_by(TrackingUpdate.recorded_at.desc())
    )
    updates = result.scalars().all()
    from app.schemas.dispatch import TrackingUpdateResponse
    return [TrackingUpdateResponse.model_validate(u) for u in updates]
