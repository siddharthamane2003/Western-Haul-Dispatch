# backend/clear_data.py
# --------------------------------------------------------------
#  Delete all rows from the core freight‑dispatch tables.
#  Run this script with:   python backend/clear_data.py
# --------------------------------------------------------------

import asyncio
from sqlalchemy import text
from app.db.database import engine, Base
from app.core.config import settings

# List of tables to empty (order matters because of FK constraints)
TABLES = [
    "dispatches",
    "order_locations",
    "freight_orders",
    "drivers",
    "vehicles",
]

# Detect database type – the dev environment uses SQLite, production uses PostgreSQL.
IS_POSTGRES = settings.DATABASE_URL.startswith("postgresql")

async def truncate():
    async with engine.begin() as conn:
        if IS_POSTGRES:
            # PostgreSQL: use TRUNCATE which is fast and resets identity sequences.
            for tbl in TABLES:
                await conn.execute(text(f"TRUNCATE TABLE {tbl} RESTART IDENTITY CASCADE"))
        else:
            # SQLite: disable foreign‑key checks, DELETE rows, then re‑enable.
            await conn.execute(text("PRAGMA foreign_keys = OFF"))
            for tbl in TABLES:
                await conn.execute(text(f"DELETE FROM {tbl}"))
            await conn.execute(text("PRAGMA foreign_keys = ON"))

    print("✅ All data cleared from:", ", ".join(TABLES))

if __name__ == "__main__":
    asyncio.run(truncate())
