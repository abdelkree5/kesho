#!/usr/bin/env python3
import sys
sys.path.append('.')

try:
    from sqlalchemy import create_engine
    print("✓ SQLAlchemy imported successfully")
except ImportError as e:
    print(f"✗ SQLAlchemy import failed: {e}")

try:
    from fastapi import FastAPI
    print("✓ FastAPI imported successfully")
except ImportError as e:
    print(f"✗ FastAPI import failed: {e}")

try:
    import bcrypt
    print("✓ bcrypt imported successfully")
except ImportError as e:
    print(f"✗ bcrypt import failed: {e}")

try:
    from jose import jwt
    print("✓ python-jose imported successfully")
except ImportError as e:
    print(f"✗ python-jose import failed: {e}")

print("Testing database connection...")
try:
    engine = create_engine("sqlite:///./test.db")
    print("✓ Database engine created successfully")
except Exception as e:
    print(f"✗ Database engine creation failed: {e}")