import os
import shutil
from fastapi import UploadFile
from app.core.config import PDF_STORAGE_DIR
def save_document(file:UploadFile):
    """
    The function `save_document` saves an uploaded file to a specified directory if the file extension
    is either '.pdf', '.doc', or '.docs'.
    
    :param file: The `file` parameter in the `save_document` function is of type `UploadFile`, which is
    typically used in web frameworks like FastAPI to represent an uploaded file. It contains information
    about the uploaded file such as the filename and the file object itself
    :type file: UploadFile
    :return: the string "File Uploaded successfully" if the file is successfully saved in the specified
    directory.
    """
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