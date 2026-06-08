from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app import crud, database, schemas
from app.routes.auth import get_current_admin

router = APIRouter(prefix="/api/categories", tags=["Categories"])

# Public endpoints
@router.get("", response_model=List[schemas.CategoryTree])
def read_category_tree(db: Session = Depends(database.get_db)):
    """Retrieve the multi-level categories tree for navigation header and catalog filters."""
    return crud.get_category_tree(db)

@router.get("/all", response_model=List[schemas.Category])
def read_all_categories(db: Session = Depends(database.get_db)):
    """Retrieve flat list of categories, useful for selection dropdowns in admin page."""
    return crud.get_categories(db)

@router.get("/{slug}", response_model=schemas.Category)
def read_category(slug: str, db: Session = Depends(database.get_db)):
    category = crud.get_category_by_slug(db, slug)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with slug '{slug}' not found"
        )
    return category

# Admin-only endpoints
@router.post("", response_model=schemas.Category, status_code=status.HTTP_201_CREATED)
def create_new_category(
    category: schemas.CategoryCreate, 
    db: Session = Depends(database.get_db),
    admin = Depends(get_current_admin)
):
    # Check if slug is unique
    existing = crud.get_category_by_slug(db, category.slug)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this slug already exists"
        )
    return crud.create_category(db, category)

@router.put("/{category_id}", response_model=schemas.Category)
def update_existing_category(
    category_id: int,
    category: schemas.CategoryCreate,
    db: Session = Depends(database.get_db),
    admin = Depends(get_current_admin)
):
    db_category = crud.update_category(db, category_id, category)
    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found"
        )
    return db_category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_category(
    category_id: int,
    db: Session = Depends(database.get_db),
    admin = Depends(get_current_admin)
):
    success = crud.delete_category(db, category_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found"
        )
    return None
