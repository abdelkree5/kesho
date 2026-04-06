from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Video, UserCourse
from app.routes.auth import get_current_user
from app.services.video_service import generate_signed_url

router = APIRouter()

@router.get("/{video_id}/stream")
async def get_video_stream(video_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if user has access to this video's course
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    user_course = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == video.course_id
    ).first()

    if not user_course:
        raise HTTPException(status_code=403, detail="Access denied")

    # Generate signed URL
    signed_url = generate_signed_url(video.url)

    return {"stream_url": signed_url, "title": video.title, "duration": video.duration}

@router.get("/course/{course_id}")
async def get_course_videos(course_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check access
    user_course = db.query(UserCourse).filter(
        UserCourse.user_id == current_user.id,
        UserCourse.course_id == course_id
    ).first()

    if not user_course:
        raise HTTPException(status_code=403, detail="Access denied")

    videos = db.query(Video).filter(Video.course_id == course_id).order_by(Video.order).all()

    return [
        {
            "id": video.id,
            "title": video.title,
            "duration": video.duration,
            "order": video.order
        }
        for video in videos
    ]