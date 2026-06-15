"""Service functions for saving uploaded documents.

This module handles validation, filesystem storage, and queueing of uploaded PDF documents.
"""

import os
import shutil
import uuid
from fastapi import UploadFile
from app.core.config import STORAGE, logger
from app.services.queue import rq_queue
from app.services.worker import run_document_injection


def save_document(file: UploadFile) -> tuple[str, str]:
    """Validates and saves a single uploaded file to the local storage.

    Args:
        file (UploadFile): The uploaded file object from FastAPI.

    Returns:
        tuple[str, str]: A tuple containing:
            - file_path (str): The absolute filepath where the file was written.
            - unique_filename (str): The unique randomized filename under which it is stored.

    Raises:
        ValueError: If the file extension is not supported (only '.pdf' allowed).
    """
    if file.filename is None:
        raise ValueError("Uploaded file has no filename.")
        
    _, extension = os.path.splitext(file.filename)
    if extension.lower() != ".pdf":
        raise ValueError("The given file is not a 'pdf'. Only PDF files are supported.")
        
    os.makedirs(STORAGE, exist_ok=True)
    unique_filename: str = f"{uuid.uuid4()}_{file.filename}"
    file_path: str = f"{STORAGE}/{unique_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    logger.info(f"Added the Document to the local directory {file_path}")
    return file_path, unique_filename


def process_uploaded_files(files: list[UploadFile]) -> str:
    """Processes a batch of uploaded files and enqueues them for worker ingestion.

    Saves files locally and adds each document processing job into the background queue.

    Args:
        files (list[UploadFile]): A list of uploaded FastAPI file instances.

    Returns:
        str: Status message indicating all files were successfully uploaded and enqueued.
    """
    processed_files: list[str] = []
    for file in files:
        file_path, file_name = save_document(file)
        rq_queue.enqueue(run_document_injection, file_path, file_name, job_timeout=600)
        logger.info(f"{file_name} has been added to the worker Queue")
        processed_files.append(file_name)
    return "Files Uploaded Successfully"


if __name__ == "__main__":
    pass

