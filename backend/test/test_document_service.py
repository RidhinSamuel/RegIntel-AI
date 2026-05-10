from io import BytesIO

import pytest
from fastapi import UploadFile

from app.services.save_documents import save_document


def test_save_valid_pdf():
    fake_pdf = BytesIO(b"Fake PDF Content")

    upload_file = UploadFile(
        filename="test.pdf",
        file=fake_pdf
    )

    result = save_document(upload_file)

    assert result == "Success"
    fake_doc = BytesIO(b"Fake doc Content")

    upload_file = UploadFile(
        filename="test.doc",
        file=fake_doc
    )

    result = save_document(upload_file)

    assert result == "Success"


def test_invalid_file_extension():
    fake_file = BytesIO(b"Not a PDF")

    upload_file = UploadFile(
        filename="malware.exe",
        file=fake_file
    )

    with pytest.raises(ValueError):
        save_document(upload_file)