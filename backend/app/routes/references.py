from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import crud, database, schemas
from app.routes.auth import get_current_admin

router = APIRouter(prefix="/api/references", tags=["References"])

# Public endpoints
@router.get("", response_model=List[schemas.Reference])
def read_references(db: Session = Depends(database.get_db)):
    """Retrieve all reference projects with longitude and latitude details to plot on maps."""
    return crud.get_references(db)

@router.get("/{ref_id}", response_model=schemas.Reference)
def read_reference(ref_id: int, db: Session = Depends(database.get_db)):
    ref = crud.get_reference_by_id(db, ref_id)
    if not ref:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reference project with id {ref_id} not found"
        )
    return ref

# Admin-only endpoints
@router.post("", response_model=schemas.Reference, status_code=status.HTTP_201_CREATED)
def create_new_reference(
    ref: schemas.ReferenceCreate,
    db: Session = Depends(database.get_db),
    admin = Depends(get_current_admin)
):
    return crud.create_reference(db, ref)

@router.put("/{ref_id}", response_model=schemas.Reference)
def update_existing_reference(
    ref_id: int,
    ref: schemas.ReferenceCreate,
    db: Session = Depends(database.get_db),
    admin = Depends(get_current_admin)
):
    db_ref = crud.update_reference(db, ref_id, ref)
    if not db_ref:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reference project with id {ref_id} not found"
        )
    return db_ref

@router.delete("/{ref_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_reference(
    ref_id: int,
    db: Session = Depends(database.get_db),
    admin = Depends(get_current_admin)
):
    success = crud.delete_reference(db, ref_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reference project with id {ref_id} not found"
        )
    return None
