from pathlib import Path

import fitz
import pandas as pd
from docx import Document


class DocumentLoader:
    """
    Reads supported document formats and converts
    them into plain text.

    Supported formats:
    - PDF
    - DOCX
    - XLSX
    """

    def load(self, file_path: str):

        extension = Path(file_path).suffix.lower()

        if extension == ".pdf":
            return self._read_pdf(file_path)

        elif extension == ".docx":
            return self._read_docx(file_path)

        elif extension == ".xlsx":
            return self._read_excel(file_path)

        else:
            raise ValueError(
                f"Unsupported file format: {extension}"
            )

    def _read_pdf(self, file_path: str):

        document = fitz.open(file_path)

        text = ""

        for page in document:

            text += page.get_text()

        document.close()

        return text

    def _read_docx(self, file_path: str):

        document = Document(file_path)

        paragraphs = []

        for paragraph in document.paragraphs:

            paragraphs.append(paragraph.text)

        return "\n".join(paragraphs)

    def _read_excel(self, file_path: str):

        dataframe = pd.read_excel(
            file_path,
            header=None
        )

        return dataframe.to_string(index=False)