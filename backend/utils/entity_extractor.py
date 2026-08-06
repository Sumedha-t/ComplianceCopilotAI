import re


class EntityExtractor:
    """
    Extracts important business entities
    from raw document text.
    """

    GSTIN_PATTERN = r"\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]\b"

    PAN_PATTERN = r"\b[A-Z]{5}\d{4}[A-Z]\b"

    CIN_PATTERN = r"\bL\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}\b"

    COMPANY_PATTERN = r"([A-Z][A-Za-z0-9&.,\-\s]+(?:Private Limited|Pvt Ltd|LLP|Limited))"

    def extract(self, raw_text: str):

        entities = {}

        gstin = re.search(self.GSTIN_PATTERN, raw_text)

        pan = re.search(self.PAN_PATTERN, raw_text)

        cin = re.search(self.CIN_PATTERN, raw_text)

        company = re.search(self.COMPANY_PATTERN, raw_text)

        entities["gstin"] = gstin.group() if gstin else None

        entities["pan"] = pan.group() if pan else None

        entities["cin"] = cin.group() if cin else None

        entities["company_name"] = (
            company.group().strip()
            if company
            else None
        )

        entities["document_type"] = self.detect_document_type(
            raw_text
        )

        return entities

    def detect_document_type(
        self,
        raw_text: str
    ):

        text = raw_text.lower()

        if "goods and services tax" in text:

            return "GST Certificate"

        if "certificate of incorporation" in text:

            return "Certificate of Incorporation"

        if "limited liability partnership" in text:

            return "LLP Registration"

        return "Unknown"