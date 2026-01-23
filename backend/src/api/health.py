"""Health check endpoint for service monitoring.

Provides a lightweight endpoint to verify API availability.
No authentication required.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["Health"])


class HealthResponse(BaseModel):
    """Health check response model."""

    status: str = "ok"
    service: str = "backend-todo-api"
    version: str = "0.1.0"


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Returns service health status. No authentication required.",
)
async def health_check() -> HealthResponse:
    """Check API health status.

    Returns basic service information to verify the API is running.
    This endpoint is not rate-limited and requires no authentication.

    Returns:
        HealthResponse: Service health status
    """
    return HealthResponse()
