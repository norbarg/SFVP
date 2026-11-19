from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field, field_validator

app = FastAPI(
    title="Laboratory Work №12 API",
    description="REST API implemented with FastAPI. Variant 13.",
    version="1.0.0",
)


class TemperatureRequest(BaseModel):
    value: float
    from_scale: Literal["celsius", "fahrenheit"]
    to_scale: Literal["celsius", "fahrenheit"]

    @field_validator("to_scale")
    @classmethod
    def validate_scales(cls, value, info):
        from_scale = info.data.get("from_scale")

        if from_scale == value:
            raise ValueError("from_scale and to_scale must be different")

        return value


class ReplaceRequest(BaseModel):
    text: str = Field(
        min_length=1,
        description="Source text",
    )

    old: str = Field(
        min_length=1,
        description="Substring to replace",
    )

    new: str = Field(
        description="Replacement substring",
    )


@app.get(
    "/",
    tags=["General"],
    summary="API status",
)
def root():
    return {
        "message": "Lab 12 API is running",
        "framework": "FastAPI",
        "variant": 13,
    }


@app.get(
    "/sum",
    tags=["GET"],
    summary="Calculate the sum of two numbers",
)
def sum_numbers(
    a: float = Query(
        ...,
        description="First number",
    ),
    b: float = Query(
        ...,
        description="Second number",
    ),
):
    return {
        "a": a,
        "b": b,
        "result": a + b,
    }


@app.post(
    "/temperature",
    tags=["POST"],
    summary="Convert temperature between scales",
)
def convert_temperature(
    data: TemperatureRequest,
):
    if data.from_scale == "celsius":
        result = (data.value * 9 / 5) + 32
    else:
        result = (data.value - 32) * 5 / 9

    return {
        "value": data.value,
        "from_scale": data.from_scale,
        "to_scale": data.to_scale,
        "result": round(result, 2),
    }


@app.patch(
    "/replace",
    tags=["PATCH"],
    summary="Replace all occurrences of a substring",
)
def replace_substring(
    data: ReplaceRequest,
):
    if data.old not in data.text:
        raise HTTPException(
            status_code=404,
            detail="Substring was not found in the source text",
        )

    result = data.text.replace(
        data.old,
        data.new,
    )

    return {
        "original": data.text,
        "old": data.old,
        "new": data.new,
        "result": result,
    }


@app.delete(
    "/remove-spaces",
    tags=["DELETE"],
    summary="Remove all spaces from a string",
)
def remove_spaces(
    text: str = Query(
        ...,
        min_length=1,
        description="Text to process",
    ),
):
    if text.strip() == "":
        raise HTTPException(
            status_code=400,
            detail="Text cannot contain only spaces",
        )

    result = text.replace(" ", "")

    return {
        "original": text,
        "result": result,
    }
