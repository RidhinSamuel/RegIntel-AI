from app.services.inject_pipeline import MultiDocumentLoader

def run_document_injection(file_path,file_name) -> None:
    """
    This function runs the document injection pipeline for a given file path and file name.
    :param file_path: The path to the file to be processed.
    :param file_name: The name of the file to be processed.
    :return: None
    """
    load = MultiDocumentLoader(file_path,file_name)
    load.load()