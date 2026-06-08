# Database Migration Strategy - String Solutions

We use **Alembic** alongside **SQLAlchemy** to manage database schema evolutions. This ensures that database updates (such as adding fields, indexes, or new models) are applied consistently across all environments (local, staging, production) without data loss.

---

## 1. Local Schema Migrations (Development)

During development, when you make changes to files like `backend/app/models.py`, perform the following steps to generate a migration script:

1. **Activate Virtual Environment & Set PYTHONPATH**:
   ```bash
   cd backend
   .venv\Scripts\activate
   ```

2. **Initialize Alembic** (Already done if `alembic.ini` is present):
   If initializing from scratch:
   ```bash
   alembic init migrations
   ```

3. **Configure connection in `migrations/env.py`**:
   Ensure `env.py` imports our models:
   ```python
   from app.database import Base
   from app.models import Category, Product, Reference, ContactInquiry
   target_metadata = Base.metadata
   ```

4. **Generate Auto-migration script**:
   ```bash
   alembic revision --autogenerate -m "Add new field to product"
   ```
   This compares your SQLAlchemy models with the database schema and creates a python script under `migrations/versions/`.

5. **Apply migration to local database**:
   ```bash
   alembic upgrade head
   ```

---

## 2. Production & Container Deployment Strategy

When deploying via **Docker** or Kubernetes, migrations should run automatically before the API service starts.

In the docker-compose setup, the backend `CMD` is configured to run Alembic migration commands before launching the Uvicorn web server:

```dockerfile
# Dockerfile Backend entry point script (run.sh)
#!/bin/sh
alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
```

This guarantees that:
- Every replica is updated to the latest database version.
- Database scheme and application code are kept in perfect sync.
