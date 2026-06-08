from sqlalchemy.orm import Session
from app import models, schemas
from passlib.context import CryptContext
from typing import List, Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ----------------- Auth CRUD -----------------
def get_admin_by_username(db: Session, username: str) -> Optional[models.AdminUser]:
    return db.query(models.AdminUser).filter(models.AdminUser.username == username).first()

def create_admin_user(db: Session, admin: schemas.AdminUserCreate) -> models.AdminUser:
    hashed_pwd = pwd_context.hash(admin.password)
    db_admin = models.AdminUser(username=admin.username, hashed_password=hashed_pwd)
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

# ----------------- Category CRUD -----------------
def get_category_by_id(db: Session, category_id: int) -> Optional[models.Category]:
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_category_by_slug(db: Session, slug: str) -> Optional[models.Category]:
    return db.query(models.Category).filter(models.Category.slug == slug).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100) -> List[models.Category]:
    return db.query(models.Category).offset(skip).limit(limit).all()

def get_category_tree(db: Session) -> List[models.Category]:
    # Returns only root categories (no parent), SQLAlchemy's backref "children" will auto-populate sub-levels
    return db.query(models.Category).filter(models.Category.parent_id == None).all()

def create_category(db: Session, category: schemas.CategoryCreate) -> models.Category:
    db_category = models.Category(
        name=category.name,
        slug=category.slug,
        description=category.description,
        parent_id=category.parent_id,
        meta_title=category.meta_title,
        meta_description=category.meta_description
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, category: schemas.CategoryCreate) -> Optional[models.Category]:
    db_category = get_category_by_id(db, category_id)
    if not db_category:
        return None
    db_category.name = category.name
    db_category.slug = category.slug
    db_category.description = category.description
    db_category.parent_id = category.parent_id
    db_category.meta_title = category.meta_title
    db_category.meta_description = category.meta_description
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int) -> bool:
    db_category = get_category_by_id(db, category_id)
    if not db_category:
        return False
    db.delete(db_category)
    db.commit()
    return True

# ----------------- Product CRUD -----------------
def get_product_by_id(db: Session, product_id: int) -> Optional[models.Product]:
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_product_by_slug(db: Session, slug: str) -> Optional[models.Product]:
    return db.query(models.Product).filter(models.Product.slug == slug).first()

def get_products(
    db: Session, 
    category_slug: Optional[str] = None, 
    voltage_class: Optional[str] = None, 
    search: Optional[str] = None, 
    skip: int = 0, 
    limit: int = 100
) -> List[models.Product]:
    query = db.query(models.Product).filter(models.Product.is_active == True)
    
    if category_slug:
        # Resolve category (and include subcategories products too if needed)
        category = get_category_by_slug(db, category_slug)
        if category:
            # Let's collect category ids (parent + direct children)
            cat_ids = [category.id]
            for child in category.children:
                cat_ids.append(child.id)
                # handle depth 2
                for grandchild in child.children:
                    cat_ids.append(grandchild.id)
            query = query.filter(models.Product.category_id.in_(cat_ids))
            
    if voltage_class:
        query = query.filter(models.Product.voltage_class == voltage_class)
        
    if search:
        query = query.filter(
            (models.Product.name.ilike(f"%{search}%")) | 
            (models.Product.description.ilike(f"%{search}%")) |
            (models.Product.excerpt.ilike(f"%{search}%"))
        )
        
    return query.offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
    db_product = models.Product(
        name=product.name,
        slug=product.slug,
        category_id=product.category_id,
        description=product.description,
        excerpt=product.excerpt,
        voltage_class=product.voltage_class,
        tech_specs=product.tech_specs,
        image_gallery=product.image_gallery,
        datasheet_url=product.datasheet_url,
        is_active=product.is_active,
        meta_title=product.meta_title,
        meta_description=product.meta_description
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductCreate) -> Optional[models.Product]:
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None
    db_product.name = product.name
    db_product.slug = product.slug
    db_product.category_id = product.category_id
    db_product.description = product.description
    db_product.excerpt = product.excerpt
    db_product.voltage_class = product.voltage_class
    db_product.tech_specs = product.tech_specs
    db_product.image_gallery = product.image_gallery
    db_product.datasheet_url = product.datasheet_url
    db_product.is_active = product.is_active
    db_product.meta_title = product.meta_title
    db_product.meta_description = product.meta_description
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int) -> bool:
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return False
    db.delete(db_product)
    db.commit()
    return True

# ----------------- Reference CRUD -----------------
def get_reference_by_id(db: Session, ref_id: int) -> Optional[models.Reference]:
    return db.query(models.Reference).filter(models.Reference.id == ref_id).first()

def get_references(db: Session, skip: int = 0, limit: int = 100) -> List[models.Reference]:
    return db.query(models.Reference).offset(skip).limit(limit).all()

def create_reference(db: Session, ref: schemas.ReferenceCreate) -> models.Reference:
    db_ref = models.Reference(
        name=ref.name,
        client=ref.client,
        city=ref.city,
        year=ref.year,
        scope=ref.scope,
        latitude=ref.latitude,
        longitude=ref.longitude,
        image_gallery=ref.image_gallery,
        meta_title=ref.meta_title,
        meta_description=ref.meta_description
    )
    db.add(db_ref)
    db.commit()
    db.refresh(db_ref)
    return db_ref

def update_reference(db: Session, ref_id: int, ref: schemas.ReferenceCreate) -> Optional[models.Reference]:
    db_ref = get_reference_by_id(db, ref_id)
    if not db_ref:
        return None
    db_ref.name = ref.name
    db_ref.client = ref.client
    db_ref.city = ref.city
    db_ref.year = ref.year
    db_ref.scope = ref.scope
    db_ref.latitude = ref.latitude
    db_ref.longitude = ref.longitude
    db_ref.image_gallery = ref.image_gallery
    db_ref.meta_title = ref.meta_title
    db_ref.meta_description = ref.meta_description
    db.commit()
    db.refresh(db_ref)
    return db_ref

def delete_reference(db: Session, ref_id: int) -> bool:
    db_ref = get_reference_by_id(db, ref_id)
    if not db_ref:
        return False
    db.delete(db_ref)
    db.commit()
    return True

# ----------------- Contact Inquiry CRUD -----------------
def create_contact_inquiry(db: Session, inquiry: schemas.ContactInquiryCreate, attachment_url: Optional[str] = None) -> models.ContactInquiry:
    db_inquiry = models.ContactInquiry(
        name=inquiry.name,
        email=inquiry.email,
        phone=inquiry.phone,
        company=inquiry.company,
        subject=inquiry.subject,
        message=inquiry.message,
        interest_product=inquiry.interest_product,
        attachment_url=attachment_url
    )
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    return db_inquiry

def get_contact_inquiries(db: Session, skip: int = 0, limit: int = 100) -> List[models.ContactInquiry]:
    return db.query(models.ContactInquiry).order_by(models.ContactInquiry.created_at.desc()).offset(skip).limit(limit).all()

# ----------------- Brand CRUD -----------------
def get_brands(db: Session, skip: int = 0, limit: int = 100) -> List[models.Brand]:
    return db.query(models.Brand).offset(skip).limit(limit).all()

def create_brand(db: Session, brand: schemas.BrandCreate) -> models.Brand:
    db_brand = models.Brand(
        name=brand.name,
        image_url=brand.image_url,
        is_active=brand.is_active
    )
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand

def update_brand(db: Session, brand_id: int, brand: schemas.BrandCreate) -> Optional[models.Brand]:
    db_brand = db.query(models.Brand).filter(models.Brand.id == brand_id).first()
    if not db_brand:
        return None
    db_brand.name = brand.name
    db_brand.image_url = brand.image_url
    db_brand.is_active = brand.is_active
    db.commit()
    db.refresh(db_brand)
    return db_brand

def delete_brand(db: Session, brand_id: int) -> bool:
    db_brand = db.query(models.Brand).filter(models.Brand.id == brand_id).first()
    if not db_brand:
        return False
    db.delete(db_brand)
    db.commit()
    return True

# ----------------- SiteSetting CRUD -----------------
def get_site_settings(db: Session) -> List[models.SiteSetting]:
    return db.query(models.SiteSetting).all()

def get_site_setting_by_key(db: Session, key: str) -> Optional[models.SiteSetting]:
    return db.query(models.SiteSetting).filter(models.SiteSetting.key == key).first()

def set_site_setting(db: Session, setting: schemas.SiteSettingCreate) -> models.SiteSetting:
    db_setting = get_site_setting_by_key(db, setting.key)
    if db_setting:
        db_setting.value = setting.value
    else:
        db_setting = models.SiteSetting(key=setting.key, value=setting.value)
        db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting

def delete_site_setting(db: Session, key: str) -> bool:
    db_setting = get_site_setting_by_key(db, key)
    if not db_setting:
        return False
    db.delete(db_setting)
    db.commit()
    return True
