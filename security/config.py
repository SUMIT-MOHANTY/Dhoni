# Security configuration for Python applications
from functools import wraps
import os
from datetime import datetime, timedelta

# Flask security configuration
def configure_flask_security(app):
    """Configure Flask app with security best practices"""
    # Set secure headers
    try:
        from flask_talisman import Talisman
        Talisman(app,
                content_security_policy={
                    'default-src': '\'self\'',
                    'script-src': ['\'self\'', '\'unsafe-inline\''],
                    'style-src': ['\'self\'', '\'unsafe-inline\''],
                    'img-src': ['\'self\'', 'data:'],
                },
                force_https=True)
    except ImportError:
        app.config.update({
            'SESSION_COOKIE_SECURE': True,
            'SESSION_COOKIE_HTTPONLY': True,
            'SESSION_COOKIE_SAMESITE': 'Lax',
            'PERMANENT_SESSION_LIFETIME': timedelta(days=1)
        })
        @app.after_request
        def set_secure_headers(response):
            response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
            response.headers['X-Content-Type-Options'] = 'nosniff'
            response.headers['X-Frame-Options'] = 'SAMEORIGIN'
            response.headers['X-XSS-Protection'] = '1; mode=block'
            return response

    # Configure CORS
    try:
        from flask_cors import CORS
        CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGIN", "*")}})
    except ImportError:
        pass

# FastAPI security configuration
def configure_fastapi_security(app):
    """Configure FastAPI app with security best practices"""
    from fastapi import Request, HTTPException
    from fastapi.middleware.cors import CORSMiddleware

    # Setup CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[os.getenv("CORS_ORIGIN", "*")],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["*"],
    )

    # Rate limiting middleware
    @app.middleware("http")
    async def rate_limit_middleware(request: Request, call_next):
        # Simple in-memory rate limiting (replace with Redis in production)
        client_ip = request.client.host
        # Implementation would go here
        response = await call_next(request)
        return response

    # Force HTTPS
    @app.middleware("http")
    async def https_redirect_middleware(request: Request, call_next):
        if request.url.scheme == "http" and os.getenv("ENVIRONMENT") == "production":
            url = request.url.copy()
            url.scheme = "https"
            return RedirectResponse(url=str(url))
        return await call_next(request)
