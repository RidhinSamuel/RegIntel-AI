"""API routes registry.

This module initializes the root API router and aggregates all endpoint sub-routers
(such as the document upload endpoints).
"""

from fastapi import APIRouter
from .upload import upload_router

api_router: APIRouter = APIRouter()
api_router.include_router(upload_router, tags=["Users"])