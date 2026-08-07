import re


class EntityExtractor:
    """
    Extracts important business entities from
    raw document text.
    """

    GSTIN_PATTERN = r"\b\d{2}[A-Z]{5}\d{4}[A-Z0-9]Z[A-Z0-9]\b"

    PAN_PATTERN = r"\b[A-Z]{5}\d{4}[A-Z]\b"

    CIN_PATTERN = r"\bL\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}\b"

    COMPANY_PATTERN = (
        r"([A-Z][A-Za-z0-9&.,()' -]+"
        r"(?:Private Limited|Pvt Ltd|LLP|Limited))"
    )

    DATE_PATTERN = (
        r"\d{1,2}\s"
        r"(January|February|March|April|May|June|July|August|"
        r"September|October|November|December)"
        r"\s\d{4}"
    )

    FACTORY_PATTERN = r"FL-[A-Z]{2}-\d{4}-\d+"

    MSME_PATTERN = r"UDYAM-[A-Z]{2}-\d{2}-\d+"

    def extract(self, raw_text: str):

        entities = {
            "document_type": self.detect_document_type(raw_text),
            "company_name": None,
            "gstin": None,
            "pan": None,
            "cin": None,
            "registration_number": None,
            "issue_date": None,
            "expiry_date": None,
        }

        company = re.search(self.COMPANY_PATTERN, raw_text)
        gst = re.search(self.GSTIN_PATTERN, raw_text)
        pan = re.search(self.PAN_PATTERN, raw_text)
        cin = re.search(self.CIN_PATTERN, raw_text)

        dates = re.findall(self.DATE_PATTERN, raw_text)

        factory = re.search(self.FACTORY_PATTERN, raw_text)

        msme = re.search(self.MSME_PATTERN, raw_text)

        if company:
            entities["company_name"] = company.group().strip()

        if gst:
            entities["gstin"] = gst.group()

        if pan:
            entities["pan"] = pan.group()

        if cin:
            entities["cin"] = cin.group()

        if factory:
            entities["registration_number"] = factory.group()

        if msme:
            entities["registration_number"] = msme.group()

        full_dates = re.finditer(
            self.DATE_PATTERN,
            raw_text
        )

        extracted_dates = [m.group() for m in full_dates]

        if len(extracted_dates) >= 1:
            entities["issue_date"] = extracted_dates[0]

        if len(extracted_dates) >= 2:
            entities["expiry_date"] = extracted_dates[1]

        return entities

    def detect_document_type(self, raw_text: str):

        text = raw_text.lower()

        if "certificate of incorporation" in text:
            return "Certificate of Incorporation"

        if "goods and services tax" in text:
            return "GST Registration"

        if "factory license" in text:
            return "Factory License"

        if "udyam registration certificate" in text:
            return "MSME Certificate"

        return "Unknown"