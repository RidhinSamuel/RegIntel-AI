from fastapi import APIRouter, UploadFile, File, HTTPException, status
from redis.exceptions import ConnectionError
from app.services import save_documents

from app.models.response import UploadResponse
from app.core.config import logger

upload_router = APIRouter()

@upload_router.post(
    "/upload", status_code=status.HTTP_200_OK, response_model=UploadResponse
)
def get_pdf_file_from_user(file: list[UploadFile] = File(...)):
    """
    This Python function receives a PDF file from a user, saves it as a document, and returns a success
    message or raises an exception for an invalid file type.

    :param file: The `file` parameter in the `get_pdf_file_from_user` function is of type `UploadFile`,
    which is a special class provided by FastAPI for handling file uploads. This parameter represents
    the file that the user is uploading through the API endpoint. The `File(...)` in the function
    signature
    :type file: UploadFile
    :return: The `get_pdf_file_from_user` function is returning an `UploadResponse` object with a
    success status and a message. If the document is successfully saved, the `UploadResponse` object
    will have `success=True` and the message returned by the `save_document` function. If an error
    occurs during the process, a `HTTPException` will be raised with a status code of 415 (
    """
    try:
        message = save_documents.process_uploaded_files(file)
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
