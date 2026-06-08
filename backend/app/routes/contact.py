from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import crud, database, schemas
from app.routes.auth import get_current_admin

router = APIRouter(prefix="/api/contact", tags=["Contact Inquiries"])

@router.post("", response_model=schemas.ContactInquiry, status_code=status.HTTP_201_CREATED)
def submit_contact_inquiry(
    inquiry: schemas.ContactInquiryCreate,
    attachment_url: Optional[str] = Query(None, description="Uploaded tender/specification file URL"),
    db: Session = Depends(database.get_db)
):
    """Submit a contact message / request for information. Saves submission to the database."""
    try:
        db_inquiry = crud.create_contact_inquiry(db, inquiry, attachment_url=attachment_url)
        # Here we would integrate Resend, SendGrid, or SMTP to send mail.
        # Print representation to simulate email dispatch:
        print(f"[EMAIL SIMULATION] Sending inquiry notification to info@stringsolutions.com")
        print(f"From: {inquiry.name} <{inquiry.email}>")
        print(f"Subject: {inquiry.subject or 'No Subject'}")
        print(f"Message: {inquiry.message}")
        if attachment_url:
            print(f"Attachment: {attachment_url}")
            
        return db_inquiry
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit inquiry: {str(e)}"
        )

@router.get("/inquiries", response_model=List[schemas.ContactInquiry])
def get_submitted_inquiries(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(database.get_db),
    admin = Depends(get_current_admin)
):
    """Retrieve all contact form inquiries submitted by users (Admin-only)."""
    return crud.get_contact_inquiries(db, skip=skip, limit=limit)
