# Compliance Copilot AI - Backend API Contract

## API Standards

### Base URL

```
http://localhost:8000
```

### JSON Convention

All request and response fields use **snake_case**.

Example:

```json
{
    "company_name": "ABC Manufacturing Pvt Ltd"
}
```

### Standard Success Response

```json
{
    "success": true,
    "message": "Operation completed successfully.",
    "data": {}
}
```

### Standard Error Response

```json
{
    "success": false,
    "message": "Validation failed.",
    "errors": [
        {
            "field": "company_name",
            "detail": "This field is required."
        }
    ]
}
```

---

# 1. New Business Consultation

**Endpoint**

```
POST /api/consultation/new
```

### Purpose

Accept business questionnaire and recommend company structure.

### Request

```json
{
    "company_name": "ABC Manufacturing Pvt Ltd",
    "industry": "Manufacturing",
    "state": "Karnataka",
    "founders": 3,
    "employees": 60,
    "annual_turnover": 30000000
}
```

### Response

```json
{
    "success": true,
    "message": "Consultation completed successfully.",
    "data": {
        "recommended_structure": "Private Limited Company",
        "required_registrations": [
            "GST",
            "PAN",
            "Factory License",
            "MSME"
        ],
        "reason": "Manufacturing business with multiple founders."
    }
}
```

### Status Codes

- 200 Success
- 400 Validation Error
- 500 Internal Server Error

---

# 2. Upload Documents

**Endpoint**

```
POST /api/documents/upload
```

### Response

```json
{
    "success": true,
    "message": "Documents uploaded successfully.",
    "data": {
        "documents_uploaded": 4
    }
}
```

---

# 3. Compliance Check

**Endpoint**

```
POST /api/compliance/check
```

### Response

```json
{
    "success": true,
    "message": "Compliance analysis completed.",
    "data": {
        "compliance_score": 92,
        "risk_level": "Medium",
        "missing_documents": [
            "Pollution Certificate"
        ],
        "expiring_documents": [
            "Fire NOC"
        ]
    }
}
```

---

# 4. Recommendation

**Endpoint**

```
POST /api/recommendation/generate
```

### Response

```json
{
    "success": true,
    "message": "Recommendations generated.",
    "data": {
        "recommendations": [
            "Renew Fire NOC.",
            "Upload Pollution Certificate."
        ]
    }
}
```

---

# 5. Lawyer Dashboard

**Endpoint**

```
GET /api/lawyer/client/{company_id}
```

### Response

```json
{
    "success": true,
    "message": "Client profile loaded.",
    "data": {
        "company_name": "ABC Manufacturing Pvt Ltd",
        "business_type": "Manufacturing",
        "state": "Karnataka",
        "compliance_score": 92,
        "risk_level": "Medium"
    }
}
```