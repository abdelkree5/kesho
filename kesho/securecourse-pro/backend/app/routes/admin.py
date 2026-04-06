from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Course, Video, ActivationCode, User, UserCourse, PaymentSettings
from pydantic import BaseModel
import secrets
import string

router = APIRouter()

class CourseCreate(BaseModel):
    title: str
    description: str = None
    price: int

class VideoCreate(BaseModel):
    course_id: int
    title: str
    url: str
    duration: int
    order: int = 0

class CodeGenerate(BaseModel):
    course_id: int
    count: int = 1

class PaymentUpdate(BaseModel):
    vodafone_cash: str
    instapay: str
    fawry: str

def generate_activation_code(length: int = 16) -> str:
    """Generate a random activation code"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))

@router.post("/courses")
async def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    db_course = Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@router.post("/videos")
async def create_video(video: VideoCreate, db: Session = Depends(get_db)):
    # Verify course exists
    course = db.query(Course).filter(Course.id == video.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    db_video = Video(**video.dict())
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

@router.post("/codes/generate")
async def generate_codes(request: CodeGenerate, db: Session = Depends(get_db)):
    # Verify course exists
    course = db.query(Course).filter(Course.id == request.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    codes = []
    for _ in range(request.count):
        code = generate_activation_code()
        activation_code = ActivationCode(code=code, course_id=request.course_id)
        db.add(activation_code)
        codes.append(code)

    db.commit()
    return {"codes": codes}

@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    users_count = db.query(User).count()
    courses_count = db.query(Course).count()
    videos_count = db.query(Video).count()
    codes_used = db.query(ActivationCode).filter(ActivationCode.used == True).count()
    codes_total = db.query(ActivationCode).count()

    return {
        "users": users_count,
        "courses": courses_count,
        "videos": videos_count,
        "codes_used": codes_used,
        "codes_total": codes_total
    }

@router.get("/users")
async def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active,
            "courses_count": len(user.user_courses),
            "devices_count": len(user.devices)
        }
        for user in users
    ]

@router.put("/payment/update")
async def update_payment_settings(payment: PaymentUpdate, db: Session = Depends(get_db)):
    # Update or create payment settings
    methods = {
        'vodafone_cash': payment.vodafone_cash,
        'instapay': payment.instapay,
        'fawry': payment.fawry
    }
    
    for method, value in methods.items():
        setting = db.query(PaymentSettings).filter(PaymentSettings.method == method).first()
        if setting:
            setting.value = value
        else:
            setting = PaymentSettings(method=method, value=value)
            db.add(setting)
    
    db.commit()
    return {"message": "Payment settings updated successfully"}