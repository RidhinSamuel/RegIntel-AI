from pydantic import BaseModel


class UploadResponse(BaseModel):
    success: bool
    message: str
    code:str = "DOC_UPLOAD_SUCCESS"