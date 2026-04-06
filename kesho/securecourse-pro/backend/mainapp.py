from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, Base, get_db
from app.models.models import User, Device, Course, Video, UserCourse, ActivationCode, PaymentSettings
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
import uvicorn
import os
import secrets
import string
from pydantic import BaseModel

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SecureCourse Pro API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-changeme")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

# ================ MODELS ================
class UserCreate(BaseModel):
    email: str
    password: str
    device_id: str
    device_info: str = None

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str

class CourseCreate(BaseModel):
    title: str
    description: str = None
    price: int = 0

class VideoCreate(BaseModel):
    course_id: int
    title: str
    url: str
    duration: int
    order: int = 0

class PaymentUpdate(BaseModel):
    vodafone_cash: str
    instapay: str
    fawry: str

class ActivationRequest(BaseModel):
    code: str

# ================ HELPER FUNCTIONS ================
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, token_type: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != token_type:
            return None
        return payload
    except:
        return None

def get_current_user(token: str = None, db: Session = Depends(get_db)):
    if not token:
        return None
    payload = verify_token(token, "access")
    if not payload:
        return None
    user_id = payload.get("sub")
    device_id = payload.get("device_id")
    if not user_id or not device_id:
        return None
    user = db.query(User).filter(User.id == int(user_id)).first()
    device = db.query(Device).filter(Device.user_id == int(user_id), Device.device_id == device_id).first()
    if user and device:
        return user
    return None

def get_current_admin(token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if not user:
        return None
    # Check if admin (simple check: email contains 'admin' or in env)
    admin_emails = os.getenv("ADMIN_EMAILS", "").split(",")
    if user.email.lower().find("admin") != -1 or user.email.lower() in [e.strip().lower() for e in admin_emails]:
        return user
    return None

# ================ ROUTES ================

@app.get("/")
async def root():
    return {"message": "SecureCourse Pro API", "status": "running"}

# ---- AUTH ROUTES ----
@app.post("/auth/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = pwd_context.hash(user.password)
    db_user = User(email=user.email, password_hash=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    device = Device(user_id=db_user.id, device_id=user.device_id, device_info=user.device_info)
    db.add(device)
    db.commit()
    
    access_token = create_access_token({"sub": str(db_user.id), "device_id": user.device_id})
    refresh_token = create_refresh_token({"sub": str(db_user.id), "device_id": user.device_id})
    
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}

@app.post("/auth/login", response_model=Token)
async def login(email: str, password: str, device_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd_context.verify(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Wrong credentials")
    
    device = db.query(Device).filter(Device.user_id == user.id, Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=403, detail="Device not authorized")
    
    access_token = create_access_token({"sub": str(user.id), "device_id": device_id})
    refresh_token = create_refresh_token({"sub": str(user.id), "device_id": device_id})
    
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}

# ---- COURSE ROUTES ----
@app.post("/courses/activate")
async def activate_code(request: ActivationRequest, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    activation_code = db.query(ActivationCode).filter(
        ActivationCode.code == request.code,
        ActivationCode.used == False
    ).first()
    
    if not activation_code:
        raise HTTPException(status_code=400, detail="Invalid code")
    
    user_course = UserCourse(user_id=user.id, course_id=activation_code.course_id)
    db.add(user_course)
    
    activation_code.used = True
    activation_code.used_by = user.id
    activation_code.used_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Course activated!"}

@app.get("/courses/")
async def get_courses(token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_courses = db.query(UserCourse).filter(UserCourse.user_id == user.id).all()
    course_ids = [uc.course_id for uc in user_courses]
    courses = db.query(Course).filter(Course.id.in_(course_ids)).all() if course_ids else []
    
    return [{"id": c.id, "title": c.title, "description": c.description, "videos_count": len(c.videos)} for c in courses]

# ---- VIDEO ROUTES ----
@app.get("/videos/course/{course_id}")
async def get_course_videos(course_id: int, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_course = db.query(UserCourse).filter(UserCourse.user_id == user.id, UserCourse.course_id == course_id).first()
    if not user_course:
        raise HTTPException(status_code=403, detail="No access")
    
    videos = db.query(Video).filter(Video.course_id == course_id).order_by(Video.order).all()
    return [{"id": v.id, "title": v.title, "duration": v.duration, "order": v.order} for v in videos]

@app.get("/videos/{video_id}/stream")
async def get_video_stream(video_id: int, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    user_course = db.query(UserCourse).filter(UserCourse.user_id == user.id, UserCourse.course_id == video.course_id).first()
    if not user_course:
        raise HTTPException(status_code=403, detail="No access")
    
    return {"stream_url": video.url, "title": video.title, "duration": video.duration}

# ---- PAYMENT ROUTES ----
@app.get("/payment/info")
async def get_payment_info(db: Session = Depends(get_db)):
    settings = db.query(PaymentSettings).all()
    payment_info = {}
    for setting in settings:
        payment_info[setting.method] = setting.value
    return payment_info

# ---- ADMIN ROUTES ----
@app.post("/admin/codes/generate")
async def generate_codes(course_id: int, count: int = 1, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    codes = []
    for _ in range(count):
        code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(16))
        activation_code = ActivationCode(code=code, course_id=course_id)
        db.add(activation_code)
        codes.append(code)
    
    db.commit()
    return {"codes": codes}

@app.post("/admin/courses")
async def create_course(course: CourseCreate, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    db_course = Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.post("/admin/videos")
async def create_video(video: VideoCreate, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == video.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db_video = Video(**video.dict())
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

@app.get("/admin/stats")
async def get_stats(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return {
        "users": db.query(User).count(),
        "courses": db.query(Course).count(),
        "videos": db.query(Video).count(),
        "codes_used": db.query(ActivationCode).filter(ActivationCode.used == True).count(),
        "codes_total": db.query(ActivationCode).count()
    }

@app.get("/admin/users")
async def get_users(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "courses_count": len(u.user_courses), "devices_count": len(u.devices)} for u in users]

@app.put("/admin/payment/update")
async def update_payment_settings(payment: PaymentUpdate, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
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

if __name__ == "__main__":
    uvicorn.run("mainapp:app", host="0.0.0.0", port=8000, reload=True)
