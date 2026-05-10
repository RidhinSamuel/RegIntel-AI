from pydantic import BaseModel


# The class `UploadResponse` defines attributes for a response to a document upload operation.
class UploadResponse(BaseModel):
    success: bool
    message: str
    code:str = "DOC_UPLOAD_SUCCESS"