import os
import shutil
import uuid
from fastapi import UploadFile
from app.core.config import STORAGE, logger
from app.services.queue import rq_queue
from app.services.worker import run_document_injection


def save_document(file: UploadFile):
    """
    The function `save_document` saves an uploaded file to a specified directory if the file extension
    is either '.pdf', '.doc', or '.docs'. urrently only pdfs

    :param file: The `file` parameter in the `save_document` function is of type `UploadFile`, which is
    typically used in web frameworks like FastAPI to represent an uploaded file. It contains information
    about the uploaded file such as the filename and the file object itself
    :type file: UploadFile
    :return: the string "File Uploaded successfully" if the file is successfully saved in the specified
    directory.
    """
    _, extension = os.path.splitext(file.filename)
    if extension not in (".pdf"):  # ,'doc','docs'
        raise ValueError("The Given File is not 'pdf' ")
    os.makedirs(STORAGE, exist_ok=True)
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = f"{STORAGE}/{unique_filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    logger.info(f"Added the Document to the local directory {file_path}")
    return file_path,unique_filename

def process_uploaded_files(files: list[UploadFile]):
    processed_files=[]
    for file in files:
        file_path, file_name = save_document(file)
        rq_queue.enqueue(run_document_injection, file_path, file_name, job_timeout=600)
        logger.info(f"{file_name} has been added to the worker Queue")
        processed_files.append(file_name)
    return "Files Uploaded Successfully"


if __name__ == "__main__":
    pass
