import time
import json
from typing import Optional
from fastapi import Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from services.security_service import security_service
from models.security import ActionType, Severity

class SecurityMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Get client info
        client_ip = self.get_client_ip(request)
        user_agent = request.headers.get("user-agent", "")
        method = request.method
        endpoint = str(request.url.path)
        
        # Rate limiting check
        if not await security_service.check_rate_limit(client_ip):
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded"}
            )
        
        # Process request
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Get user ID if authenticated
        user_id = getattr(request.state, 'user_id', None)
        
        # Log API call
        await self.log_api_call(
            user_id=user_id,
            method=method,
            endpoint=endpoint,
            status_code=response.status_code,
            ip_address=client_ip,
            user_agent=user_agent,
            process_time=process_time
        )
        
        # Add security headers
        self.add_security_headers(response)
        
        return response

    def get_client_ip(self, request: Request) -> str:
        """Get client IP address handling proxies."""
        # Check for common proxy headers
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"

    async def log_api_call(
        self,
        user_id: Optional[str],
        method: str,
        endpoint: str,
        status_code: int,
        ip_address: str,
        user_agent: str,
        process_time: float
    ):
        """Log API call for audit purposes."""
        # Determine severity based on status code
        if status_code >= 500:
            severity = Severity.HIGH
        elif status_code >= 400:
            severity = Severity.MEDIUM
        else:
            severity = Severity.LOW
        
        # Don't log every successful call to avoid spam (only important endpoints)
        important_endpoints = ['/api/auth/', '/api/users/', '/api/admin/']
        
        if (status_code >= 400 or 
            any(endpoint.startswith(important) for important in important_endpoints)):
            
            await security_service.log_audit_event(
                user_id=user_id,
                action=ActionType.API_CALL,
                resource="api",
                endpoint=endpoint,
                method=method,
                status_code=status_code,
                ip_address=ip_address,
                user_agent=user_agent,
                severity=severity,
                details={
                    "process_time": process_time,
                    "response_code": status_code
                }
            )

    def add_security_headers(self, response: Response):
        """Add security headers to response."""
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Content-Security-Policy": "default-src 'self'",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
        }
        
        for header_name, header_value in security_headers.items():
            response.headers[header_name] = header_value

class AuthMiddleware:
    """Middleware to inject user information into request state."""
    
    @staticmethod
    async def add_user_to_state(request: Request, user_id: str, user_email: str):
        """Add user information to request state for logging."""
        request.state.user_id = user_id
        request.state.user_email = user_email