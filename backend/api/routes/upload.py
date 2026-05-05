from pathlib import Path

from fastapi import APIRouter, UploadFile, File

BASE_DIR = Path(__file__)
upload_router = APIRouter()

@upload_router.post("/upload")
def get_pdf_file_from_user(file:UploadFile):
    return {"FileName":file.filename,
            "File Path":BASE_DIR}