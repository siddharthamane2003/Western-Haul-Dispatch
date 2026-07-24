"""One-shot verification of trip create → locations → list flow."""
import asyncio
import json
import uuid
from datetime import date
from pathlib import Path

from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.database import Base, get_db
from app.main import app
from app.models import Company, Customer, User, UserRole, UserStatus

LOG_PATH = Path(__file__).resolve().parents[2] / "debug-a44aee.log"
TEST_DB = "sqlite+aiosqlite:///./verify_trip_flow.db"

engine = create_async_engine(TEST_DB, echo=False)
Session = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


async def seed(session: AsyncSession) -> tuple[User, Customer]:
    company = Company(id=uuid.uuid4(), name="Test Co", is_active=True)
    session.add(company)
    user = User(
        id=uuid.uuid4(),
        email="dispatcher@test.com",
        username="dispatcher",
        hashed_password="x",
        full_name="Dispatcher",
        role=UserRole.DISPATCHER,
        company_id=company.id,
        status=UserStatus.ACTIVE,
        is_superuser=False,
    )
    session.add(user)
    customer = Customer(
        id=uuid.uuid4(),
        company_id=company.id,
        company_name="B2B TRANSPORTATION SERVICES, INC.",
        customer_code="CUST-0001",
        phone="555-0100",
        is_active=True,
    )
    session.add(customer)
    await session.commit()
    return user, customer


async def override_get_db():
    async with Session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with Session() as session:
        user, customer = await seed(session)

    from app.core.security import create_access_token

    token = create_access_token(str(user.id))
    headers = {"Authorization": f"Bearer {token}"}

    app.dependency_overrides[get_db] = override_get_db

    results = []
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        create_payload = {
            "customer_id": str(customer.id),
            "priority": "normal",
            "material_type": "General Freight",
            "weight_tons": 1,
            "pickup_date": str(date.today()),
            "freight_amount": 100,
            "payment_mode": "CAD",
            "internal_notes": json.dumps({"freightBrokerName": "B2B", "loadNumber": "LD-001"}),
            "load_number": "LD-001",
            "locations": [],
        }
        r = await client.post("/api/v1/orders/", json=create_payload, headers=headers)
        results.append({"step": "create_order", "status": r.status_code, "body": r.json() if r.status_code < 500 else r.text})
        assert r.status_code == 201, r.text
        order = r.json()
        order_id = order["id"]

        loc_payload = [
            {
                "name": "Add Location",
                "address": "123 Pickup St",
                "location_type": "pickup",
                "sequence": 1,
                "contact_person": "Pickup Receiver",
            },
            {
                "name": "Add Location 2",
                "address": "456 Delivery Ave",
                "location_type": "delivery",
                "sequence": 2,
                "contact_person": "Delivery Receiver",
            },
        ]
        r2 = await client.post(
            f"/api/v1/orders/{order_id}/locations?replace=true",
            json=loc_payload,
            headers=headers,
        )
        results.append({"step": "add_locations", "status": r2.status_code, "location_count": len(r2.json().get("locations", []))})
        assert r2.status_code == 200, r2.text
        loc_response = r2.json()

        r3 = await client.get("/api/v1/orders/", headers=headers)
        items = r3.json()["items"]
        listed = items[0] if items else {}
        locs = sorted(listed.get("locations", []), key=lambda l: l.get("sequence", 0))
        results.append({
            "step": "list_orders",
            "order_number_tripId": listed.get("order_number"),
            "load_number_load": listed.get("load_number"),
            "first_location_name": locs[0]["name"] if len(locs) > 0 else None,
            "second_location_name": locs[1]["name"] if len(locs) > 1 else None,
            "location_count": len(locs),
            "create_response_order_number": order.get("order_number"),
            "create_response_load_number": order.get("load_number"),
        })

    log_lines = [
        {"sessionId": "a44aee", "message": "verify_trip_flow", "data": results, "hypothesisId": "A"},
    ]
    with LOG_PATH.open("w", encoding="utf-8") as f:
        for line in log_lines:
            f.write(json.dumps(line) + "\n")

    print(json.dumps(results, indent=2))
    print(f"Log written to {LOG_PATH}")


if __name__ == "__main__":
    asyncio.run(main())
