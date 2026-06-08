from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Self-referential relationship for parent-child tree
    parent_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=True)
    
    # SEO columns
    meta_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)

    # Relationships
    parent = relationship("Category", remote_side=[id], backref="children")
    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=True)  # Rich text HTML description
    excerpt = Column(Text, nullable=True)      # Short summary
    voltage_class = Column(String, nullable=True)  # e.g., "Medium Voltage", "High Voltage", "Low Voltage"
    
    # JSON arrays and objects
    tech_specs = Column(JSON, nullable=True)      # e.g., {"Voltage": "12kV", "Current": "630A"}
    image_gallery = Column(JSON, nullable=True)   # Array of image URLs
    datasheet_url = Column(String, nullable=True) # PDF download link
    
    is_active = Column(Boolean, default=True)
    
    # SEO columns
    meta_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)

    # Relationships
    category = relationship("Category", back_populates="products")

class Reference(Base):
    __tablename__ = "references"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    client = Column(String, nullable=True)
    city = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    scope = Column(Text, nullable=True)
    
    # Location coordinates for global map
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    image_gallery = Column(JSON, nullable=True)   # Array of image URLs
    
    # SEO columns
    meta_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)

class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    subject = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    interest_product = Column(String, nullable=True) # Selected from dynamic dropdown
    attachment_url = Column(String, nullable=True)   # PDF/DOCX resume or specification tender
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

class SiteSetting(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(Text, nullable=True)
