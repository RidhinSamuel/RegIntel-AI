from fastapi import APIRouter
from upload import upload_router

api_router = APIRouter()
api_router.include_router(upload_router, tags=["Users"])