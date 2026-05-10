from io import BytesIO

# from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.routes import upload_router
from app.main import app
client = TestClient(app)


def test_upload_valid_pdf():
    """
    Test successful PDF upload.
    """

    file_content = b"Dummy PDF Content"

    response = client.post(
        "/api/upload",
        files={
            "file": (
                "sample.pdf",
                BytesIO(file_content),
                "multipart/form-data",
            )
        },
    )

    # assert response.status_code == 200

    response_data = response.json()
    print("Response data",response_data)
    assert response_data["success"] is True
    assert response_data["code"] == "DOC_UPLOAD_SUCCESS"


def test_upload_valid_doc():
    """
    Test successful DOC upload.
    """

    file_content = b"Dummy DOC Content"

    response = client.post(
        "/api/upload",
        files={
            "file": (
                "document.doc",
                BytesIO(file_content),
                "multipart/form-data",
            )
        },
    )

    assert response.status_code == 200

    response_data = response.json()

    assert response_data["success"] is True


def test_upload_invalid_file_type():
    """
    Test invalid file type upload.
    """

    file_content = b"Executable content"

    response = client.post(
        "/api/upload",
        files={
            "file": (
                "virus.exe",
                BytesIO(file_content),
                "multipart/form-data",
            )
        },
    )

    assert response.status_code == 415

    response_data = response.json()

    assert response_data["detail"]["code"] == "INVALID_FILE_TYPE"


def test_upload_missing_file():
    """
    Test request without file.
    """

    response = client.post(
        "/api/upload",
        files=None,
    )

    assert response.status_code == 422


def test_upload_empty_pdf():
    """
    Test empty PDF upload.
    """

    response = client.post(
        "/api/upload",
        files={
            "file": (
                "empty.pdf",
                BytesIO(b""),
                "multipart/form-data",
            )
        },
    )

    assert response.status_code == 200


def test_upload_uppercase_extension():
    """
    Test uppercase file extension.
    """
    response = client.post(
        "/api/upload",
        files={
            "file": (
                "REPORT.PDF",
                BytesIO(b"dummy"),
                "multipart/form-data",
            )
        },
    )

    assert response.status_code == 415
