import os

from pathlib import Path
from fastapi import APIRouter, UploadFile, File
from app.services import pdf_service


upload_router = APIRouter()

@upload_router.post("/upload")
def get_pdf_file_from_user(file:UploadFile = File(...)):
    pdf_service.save_pdf(file)
    return {"FileName":file.filename,
            "File Path":BASE_DIR}