import os
import shutil
from fastapi import UploadFile
from app.core.config import PDF_STORAGE_DIR
def save_document(file:UploadFile):
    _, extension = os.path.splitext(file.filename)
    if extension not in ('.pdf','.doc','.docs'):
        raise ValueError("The Given File is not 'pdf','doc','docs' ")
    os.makedirs(PDF_STORAGE_DIR, exist_ok=True)
    file_path = f"{PDF_STORAGE_DIR}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return "File Uploaded successfully"
if __name__ == "__main__":
    pass