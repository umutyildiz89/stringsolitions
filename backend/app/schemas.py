from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# ----------------- JWT Authentication Schemas -----------------
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class AdminUserCreate(BaseModel):
    username: str
    password: str

class AdminUser(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

# ----------------- Category Schemas -----------------
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[int] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class CategoryTree(Category):
    children: List["CategoryTree"] = []

    class Config:
        from_attributes = True

# Required for recursive references
CategoryTree.model_rebuild()

# ----------------- Product Schemas -----------------
class ProductBase(BaseModel):
    name: str
    slug: str
    category_id: int
    description: Optional[str] = None
    excerpt: Optional[str] = None
    voltage_class: Optional[str] = None
    tech_specs: Optional[Dict[str, Any]] = None
    image_gallery: Optional[List[str]] = None
    datasheet_url: Optional[str] = None
    is_active: Optional[bool] = True
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

# ----------------- Reference Schemas -----------------
class ReferenceBase(BaseModel):
    name: str
    client: Optional[str] = None
    city: Optional[str] = None
    year: Optional[int] = None
    scope: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_gallery: Optional[List[str]] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class ReferenceCreate(ReferenceBase):
    pass

class Reference(ReferenceBase):
    id: int

    class Config:
        from_attributes = True

# ----------------- Contact Inquiry Schemas -----------------
class ContactInquiryBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    subject: Optional[str] = None
    message: str
    interest_product: Optional[str] = None

class ContactInquiryCreate(ContactInquiryBase):
    pass

class ContactInquiry(ContactInquiryBase):
    id: int
    attachment_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Brand Schemas -----------------
class BrandBase(BaseModel):
    name: str
    image_url: str
    is_active: Optional[bool] = True

class BrandCreate(BrandBase):
    pass

class Brand(BrandBase):
    id: int

    class Config:
        from_attributes = True

# ----------------- SiteSetting Schemas -----------------
class SiteSettingBase(BaseModel):
    key: str
    value: Optional[str] = None

class SiteSettingCreate(SiteSettingBase):
    pass

class SiteSetting(SiteSettingBase):
    id: int

    class Config:
        from_attributes = True
