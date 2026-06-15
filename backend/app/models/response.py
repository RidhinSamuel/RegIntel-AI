from pydantic import BaseModel, Field

class UploadResponse(BaseModel):
    """Pydantic model representing the API response for file upload requests.

    Attributes:
        success (bool): Indicates if the file upload and queueing succeeded.
        message (str): Explanatory status message.
        code (str): Machine-readable status code for the response.
    """
    success: bool = Field(
        ..., 
        description="Indicates if the file upload and task queueing were successful.",
        example=True
    )
    message: str = Field(
        ..., 
        description="A human-readable message detailing the outcome of the upload process.",
        example="Files Uploaded Successfully"
    )
    code: str = Field(
        default="DOC_UPLOAD_SUCCESS", 
        description="Machine-readable status code representing the transaction status.",
        example="DOC_UPLOAD_SUCCESS"
    )