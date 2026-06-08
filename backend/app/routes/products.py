from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import crud, database, schemas
from app.routes.auth import get_current_admin

router = APIRouter(prefix="/api/products", tags=["Products"])

# Public endpoints
@router.get("", response_model=List[schemas.Product])
def read_products(
    category: Optional[str] = Query(None, description="Category slug to filter by"),
    voltage_class: Optional[str] = Query(None, description="Voltage class to filter by"),
    search: Optional[str] = Query(None, description="Search keyword"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(database.get_db)
):
    """Filter products dynamically by Category Slug, Voltage Class, or Search query."""
    return crud.get_products(db, category_slug=category, voltage_class=voltage_class, search=search, skip=skip, limit=limit)

@router.get("/{slug}", response_model=schemas.Product)
def read_product(slug: str, db: Session = Depends(database.get_db)):
    product = crud.get_product_by_slug(db, slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with slug '{slug}' not found"
        )
    return product

# Admin-only endpoints
@router.post("", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_new_product(
    product: schemas.ProductCreate,
    db: Session = Depends(database.get_db),
    admin = Depends(get_current_admin)
):
    # Verify slug is unique
    existing = crud.get_product_by_slug(db, product.slug)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this slug already exists"
        )
        
    # Verify category exists
    category = crud.get_category_by_id(db, product.category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with id {product.category_id} does not exist"
        )
        
    return crud.create_product(db, product)

@router.put("/{product_id}", response_model=schemas.Product)
def update_existing_product(
    product_id: int,
    product: schemas.ProductCreate,
    db: Session = Depends(database.get_db),
    admin = Depends(get_current_admin)
):
    # Verify category exists
    category = crud.get_category_by_id(db, product.category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with id {product.category_id} does not exist"
        )
        
    db_product = crud.update_product(db, product_id, product)
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_product(
    product_id: int,
    db: Session = Depends(database.get_db),
    admin = Depends(get_current_admin)
):
    success = crud.delete_product(db, product_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    return None
