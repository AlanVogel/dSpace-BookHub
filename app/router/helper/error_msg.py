from fastapi import HTTPException

def get_credential_exception(status_code: int, details: str, headers: dict[str, str] | None):
    credential_exception = HTTPException(status_code = status_code,
                                         detail = details,
                                         headers = headers)
    return credential_exception