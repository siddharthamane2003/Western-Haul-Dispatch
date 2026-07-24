# backend/reset_db.py
# --------------------------------------------------------------
# Drop all tables and recreate the schema.
# Run from the backend directory so that the 'app' package is importable.
# --------------------------------------------------------------

import asyncio
from app.db.database import drop_all_tables, create_all_tables

async def reset():
    print("🗑️ Dropping all tables …")
    await drop_all_tables()
    print("✅ Dropped.")
    print("🔧 Creating tables …")
    await create_all_tables()
    print("✅ Created.")

if __name__ == "__main__":
    asyncio.run(reset())
