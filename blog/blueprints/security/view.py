from sanic import Blueprint
from sanic_security.authentication import register, login, logout
from sanic_security.utils import json
from sanic_security.verification import requires_captcha, request_captcha

security_bp = Blueprint("security")


@security_bp.post("/register")
@requires_captcha()
async def on_register(request, captcha_session):
    account = await register(request)
    response = json("Registration successful.", account.json)
    return response


@security_bp.get("/captcha")
async def on_captcha_img_request(request):
    captcha_session = await request_captcha(request)
    response = captcha_session.get_image()
    captcha_session.encode(response)
    return response


@security_bp.post("/login")
async def on_login(request):
    authentication_session = await login(request)
    response = json("Login successful.", authentication_session.bearer.json)
    authentication_session.encode(response)
    return response


@security_bp.post("/logout")
async def on_logout(request):
    authentication_session = await logout(request)
    response = json("Logout successful.", authentication_session.bearer.json)
    return response
