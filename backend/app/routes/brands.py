from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import schemas, crud
from app.database import get_db
from app.routes.auth import get_current_admin

router = APIRouter(prefix="/api/brands", tags=["Brands"])

@router.get("/", response_model=List[schemas.Brand])
def read_brands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_brands(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Brand, status_code=status.HTTP_201_CREATED)
def create_brand(
    brand: schemas.BrandCreate, 
    db: Session = Depends(get_db),
    admin: schemas.AdminUser = Depends(get_current_admin)
):
    return crud.create_brand(db=db, brand=brand)

@router.put("/{brand_id}", response_model=schemas.Brand)
def update_brand(
    brand_id: int, 
    brand: schemas.BrandCreate, 
    db: Session = Depends(get_db),
    admin: schemas.AdminUser = Depends(get_current_admin)
):
    db_brand = crud.update_brand(db=db, brand_id=brand_id, brand=brand)
    if not db_brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return db_brand

@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_brand(
    brand_id: int, 
    db: Session = Depends(get_db),
    admin: schemas.AdminUser = Depends(get_current_admin)
):
    success = crud.delete_brand(db=db, brand_id=brand_id)
    if not success:
        raise HTTPException(status_code=404, detail="Brand not found")
    return None
