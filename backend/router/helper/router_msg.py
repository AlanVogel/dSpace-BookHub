from typing import Optional
from fastapi import HTTPException
from datetime import datetime

def error_exception(status_code: int, details: str, headers: Optional[dict[str, str]]):
    credential_exception = HTTPException(status_code = status_code,
                                         detail = details,
                                         headers = headers)
    return credential_exception

def ok_response(status_code: int, details: str, **additional_data):
    data = {
        "status": "OK",
        "code": status_code,
        "server_time": now().strftime("%Y-%m-%dT%H:%M:%S"),
        "details": details
    }

    for key, value in additional_data.items():
        data["{0}".format(key)] = value
    return {"status_code": status_code, "info": {"data": data}}

def now() -> datetime:
    return datetime.now()
