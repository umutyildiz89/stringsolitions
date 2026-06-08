from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.config import UPLOAD_DIR
from app.routes import auth, categories, products, references, contact, media, brands, settings
import os

# Create DB tables (if not using migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="String Solutions API",
    description="Industrial Energy and Automation Solutions PIM & CMS API",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "*" # Fallback for flexibility
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads folder
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(references.router)
app.include_router(contact.router)
app.include_router(media.router)
app.include_router(brands.router)
app.include_router(settings.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "String Solutions API",
        "documentation": "/docs"
    }
