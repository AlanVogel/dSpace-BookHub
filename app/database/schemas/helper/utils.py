from pydantic import ValidationError


def validation_check(data: dict, checker):
    try:
        checker(**data)
    except ValidationError as e:
        return str(e)