"""Endpoints for document upload and processing.

This module exposes the API routes for uploading documents (such as PDFs) and
forwarding them to background workers via Redis/Valkey task queues.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from redis.exceptions import ConnectionError
from app.services import save_documents

from app.models.response import UploadResponse
from app.core.config import logger

upload_router: APIRouter = APIRouter()

@upload_router.post(
    "/upload", 
    status_code=status.HTTP_200_OK, 
    response_model=UploadResponse,
    summary="Upload multiple PDF documents",
    description=(
        "Receives a list of PDF files, validates their formats, "
        "saves them to the local workspace storage, and enqueues them "
        "into the background processing worker queue."
    ),
    response_description="A response JSON detailing the success of the queueing/upload operation.",
    responses={
        status.HTTP_200_OK: {
            "model": UploadResponse,
            "description": "Files were successfully uploaded and enqueued for processing."
        },
        status.HTTP_415_UNSUPPORTED_MEDIA_TYPE: {
            "description": "One or more files have an invalid or unsupported file format."
        },
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "Failed to connect to the Redis task queue."
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "An unexpected error occurred on the server."
        }
    }
)
def get_pdf_file_from_user(file: list[UploadFile] = File(...)) -> UploadResponse:
    """Handles HTTP POST request to upload documents.

    Saves files locally and registers an asynchronous ingestion job in the Redis task queue.

    Args:
        file (list[UploadFile]): A list of uploaded files from the multipart form request.

    Returns:
        UploadResponse: Response containing success status, message, and transaction code.

    Raises:
        HTTPException: 415 if files are not of type PDF.
        HTTPException: 503 if the Redis queue connection is unavailable.
        HTTPException: 500 if any internal system error occurs.
    """
    try:
        message: str = save_documents.process_uploaded_files(file)
        return UploadResponse(success=True, message=message)
    except ValueError as error:
        logger.error(str(error))
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail={"code": "INVALID_FILE_TYPE", "message": str(error)},
        )
    except ConnectionError as error:
        logger.error(str(error))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"code": "QUEUE_ERROR", "message": str(error)},
        )
    except Exception as error:
        logger.error(str(error))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_ERROR", "message": str(error)},
        )

