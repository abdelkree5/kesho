import boto3
from botocore.client import Config
import os
from datetime import datetime, timedelta

# AWS S3 configuration (for signed URLs)
S3_BUCKET = os.getenv("S3_BUCKET", "your-bucket")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")

def generate_signed_url(video_url: str) -> str:
    """
    Generate a signed URL for video streaming.
    Supports both S3 and Cloudflare Stream.
    """
    if "cloudflare" in video_url.lower():
        return generate_cloudflare_signed_url(video_url)
    else:
        return generate_s3_signed_url(video_url)

def generate_s3_signed_url(video_url: str) -> str:
    """Generate signed URL for S3"""
    s3_client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
        config=Config(signature_version='s3v4')
    )

    # Extract key from URL
    key = video_url.split('/')[-1]

    signed_url = s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': S3_BUCKET,
            'Key': key
        },
        ExpiresIn=300  # 5 minutes
    )

    return signed_url

def generate_cloudflare_signed_url(video_url: str) -> str:
    """Generate signed URL for Cloudflare Stream"""
    # This is a simplified example. In production, implement proper JWT signing
    # as per Cloudflare Stream documentation

    # For now, return the URL with a short expiry token
    # In real implementation, use Cloudflare's signed URL generation

    return video_url  # Placeholder