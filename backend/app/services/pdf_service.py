import os
from fastapi import UploadFile
from app.core.config import BASE_DIR
def save_pdf(file:UploadFile):
    _, extension = os.path.splitext(file.filename)
    if extension not in ('pdf','doc','docs'):
        raise ValueError("The Given File is not 'pdf','doc','docs' ")
    
if "__name__" == "__main__":
    pass