from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database import get_db
from app.models.models import User, Device
from app.services.auth_service import create_access_token, create_refresh_token, verify_token
from pydantic import BaseModel
import secrets

router = APIRouter()

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", optional=True)

# Pydantic models
class UserCreate(BaseModel):
    email: str
    password: str
    device_id: str
    device_info: str = None

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str

class TokenRefresh(BaseModel):
    refresh_token: str

class DeviceBind(BaseModel):
    device_id: str
    device_info: str = None

@router.post("/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Create user
    db_user = User(email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Bind device
    device = Device(
        user_id=db_user.id,
        device_id=user.device_id,
        device_info=user.device_info
    )
    db.add(device)
    db.commit()

    # Create tokens
    access_token = create_access_token(data={"sub": str(db_user.id), "device_id": user.device_id})
    refresh_token = create_refresh_token(data={"sub": str(db_user.id), "device_id": user.device_id})

    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), device_id: str = None, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    # Check device binding
    device = db.query(Device).filter(Device.user_id == user.id, Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=403, detail="Device not authorized")

    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id), "device_id": device_id})
    refresh_token = create_refresh_token(data={"sub": str(user.id), "device_id": device_id})

    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}

@router.post("/refresh", response_model=Token)
async def refresh_token(token: TokenRefresh, db: Session = Depends(get_db)):
    try:
        payload = verify_token(token.refresh_token, "refresh")
        user_id: str = payload.get("sub")
        device_id: str = payload.get("device_id")

        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        device = db.query(Device).filter(Device.user_id == user.id, Device.device_id == device_id).first()
        if not device:
            raise HTTPException(status_code=403, detail="Device not authorized")

        access_token = create_access_token(data={"sub": str(user.id), "device_id": device_id})
        refresh_token = create_refresh_token(data={"sub": str(user.id), "device_id": device_id})

        return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_token(token, "access")
        user_id: str = payload.get("sub")
        device_id: str = payload.get("device_id")
        if user_id is None or device_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    device = db.query(Device).filter(Device.user_id == user.id, Device.device_id == device_id).first()
    if not device:
        raise credentials_exception

    return user