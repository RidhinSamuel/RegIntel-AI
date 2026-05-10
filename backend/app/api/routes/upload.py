from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services import save_documents
from app.models.response import UploadResponse

upload_router = APIRouter()

@upload_router.post("/upload",status_code=status.HTTP_200_OK,response_model=UploadResponse)
def get_pdf_file_from_user(file:UploadFile = File(...)):
    try:
        message = save_documents.save_document(file)
        return UploadResponse(
            success= True,
            message = message
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail={
                "code": "INVALID_FILE_TYPE",
                "message": str(error)
            }
        )