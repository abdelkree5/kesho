from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Course, UserCourse, ActivationCode
from app.routes.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class ActivationRequest(BaseModel):
    code: str

@router.post("/activate")
async def activate_code(request: ActivationRequest, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Find activation code
    activation_code = db.query(ActivationCode).filter(
        ActivationCode.code == request.code,
        ActivationCode.used == False
    ).first()

    if not activation_code:
        raise HTTPException(status_code=400, detail="Invalid or used activation code")

    # Check if user already has this course
    existing = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == activation_code.course_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Course already activated")

    # Activate course
    user_course = UserCourse(user_id=current_user.id, course_id=activation_code.course_id)
    db.add(user_course)

    # Mark code as used
    activation_code.used = True
    activation_code.used_by = current_user.id
    activation_code.used_at = db.func.now()

    db.commit()

    return {"message": "Course activated successfully"}

@router.get("/")
async def get_courses(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get user's activated courses
    user_courses = db.query(UserCourse).filter(UserCourse.user_id == current_user.id).all()
    course_ids = [uc.course_id for uc in user_courses]

    courses = db.query(Course).filter(Course.id.in_(course_ids)).all()

    return [
        {
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "videos_count": len(course.videos)
        }
        for course in courses
    ]