from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from pathlib import Path
import uuid
import shutil
from PIL import Image
import io
from app.config import UPLOAD_DIR
from app.routes.auth import get_current_admin
from typing import List

router = APIRouter(prefix="/api/media", tags=["Media"])

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
ALLOWED_DOC_EXTENSIONS = {".pdf", ".docx", ".doc", ".xlsx", ".xls"}

def compress_image(file_bytes: bytes, extension: str) -> tuple[bytes, str]:
    """Compress image and convert to WebP format if it's a standard image format."""
    try:
        image = Image.open(io.BytesIO(file_bytes))
        
        # Convert to RGB if it's RGBA but saving as WebP handles alpha.
        # Actually WebP handles transparency, so RGBA is fine.
        output = io.BytesIO()
        image.save(output, format="WEBP", quality=80, optimize=True)
        return output.getvalue(), ".webp"
    except Exception as e:
        # Fallback to saving original bytes if PIL fails
        return file_bytes, extension

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename
    ext = Path(filename).suffix.lower()
    
    is_image = ext in ALLOWED_IMAGE_EXTENSIONS
    is_doc = ext in ALLOWED_DOC_EXTENSIONS
    
    if not (is_image or is_doc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Only standard images and documents (PDF, Word, Excel) are allowed."
        )
        
    file_bytes = await file.read()
    
    # Generate unique filename to prevent overwriting
    unique_id = uuid.uuid4().hex
    
    if is_image:
        # Compress and convert to webp
        compressed_bytes, new_ext = compress_image(file_bytes, ext)
        new_filename = f"{unique_id}{new_ext}"
        save_path = UPLOAD_DIR / new_filename
        
        with open(save_path, "wb") as buffer:
            buffer.write(compressed_bytes)
    else:
        # Save document as is
        new_filename = f"{unique_id}{ext}"
        save_path = UPLOAD_DIR / new_filename
        
        with open(save_path, "wb") as buffer:
            buffer.write(file_bytes)
            
    # Return file URL path
    return {"url": f"/uploads/{new_filename}", "filename": filename}

@router.post("/upload-multiple")
async def upload_multiple_files(files: List[UploadFile] = File(...)):
    results = []
    for file in files:
        try:
            res = await upload_file(file)
            results.append(res)
        except HTTPException as e:
            results.append({"filename": file.filename, "error": e.detail})
    return results

@router.get("/all")
async def list_all_media():
    files = []
    if UPLOAD_DIR.exists():
        for f in UPLOAD_DIR.iterdir():
            if f.is_file():
                # Provide a basic payload
                files.append({
                    "filename": f.name,
                    "url": f"/uploads/{f.name}",
                    "size": f.stat().st_size
                })
    return files

@router.delete("/{filename}")
async def delete_media(filename: str, admin: dict = Depends(get_current_admin)):
    # Simple security to prevent path traversal
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
        
    file_path = UPLOAD_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
        
    file_path.unlink()
    return {"status": "deleted", "filename": filename}
