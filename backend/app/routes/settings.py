from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import schemas, crud
from app.database import get_db
from app.routes.auth import get_current_admin

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("/", response_model=List[schemas.SiteSetting])
def read_settings(db: Session = Depends(get_db)):
    return crud.get_site_settings(db)

@router.get("/{key}", response_model=schemas.SiteSetting)
def read_setting(key: str, db: Session = Depends(get_db)):
    db_setting = crud.get_site_setting_by_key(db, key=key)
    if not db_setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return db_setting

@router.post("/", response_model=schemas.SiteSetting)
def set_setting(
    setting: schemas.SiteSettingCreate, 
    db: Session = Depends(get_db),
    admin: schemas.AdminUser = Depends(get_current_admin)
):
    return crud.set_site_setting(db=db, setting=setting)

@router.delete("/{key}", status_code=status.HTTP_204_NO_CONTENT)
def delete_setting(
    key: str, 
    db: Session = Depends(get_db),
    admin: schemas.AdminUser = Depends(get_current_admin)
):
    success = crud.delete_site_setting(db=db, key=key)
    if not success:
        raise HTTPException(status_code=404, detail="Setting not found")
    return None
