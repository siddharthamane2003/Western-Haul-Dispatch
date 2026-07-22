"""add_extra_order_location_fields

Revision ID: b2948bdd0692
Revises: 
Create Date: 2026-07-22 18:01:02.315033

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'b2948bdd0692'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add extra warehouse/stop fields to order_locations
    op.add_column('order_locations', sa.Column('commodity', sa.String(length=255), nullable=True))
    op.add_column('order_locations', sa.Column('weight', sa.Numeric(precision=10, scale=2), nullable=True))
    op.add_column('order_locations', sa.Column('qty', sa.Integer(), nullable=True))
    op.add_column('order_locations', sa.Column('start_date', sa.String(length=20), nullable=True))
    op.add_column('order_locations', sa.Column('start_time', sa.String(length=10), nullable=True))
    op.add_column('order_locations', sa.Column('end_date', sa.String(length=20), nullable=True))
    op.add_column('order_locations', sa.Column('end_time', sa.String(length=10), nullable=True))
    op.add_column('order_locations', sa.Column('appt', sa.Boolean(), nullable=True))
    op.add_column('order_locations', sa.Column('appt_date', sa.String(length=20), nullable=True))
    op.add_column('order_locations', sa.Column('appt_time', sa.String(length=10), nullable=True))


def downgrade() -> None:
    op.drop_column('order_locations', 'appt_time')
    op.drop_column('order_locations', 'appt_date')
    op.drop_column('order_locations', 'appt')
    op.drop_column('order_locations', 'end_time')
    op.drop_column('order_locations', 'end_date')
    op.drop_column('order_locations', 'start_time')
    op.drop_column('order_locations', 'start_date')
    op.drop_column('order_locations', 'qty')
    op.drop_column('order_locations', 'weight')
    op.drop_column('order_locations', 'commodity')
