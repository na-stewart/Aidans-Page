from sanic import Blueprint
from sanic_security.authentication import register, login, logout
from sanic_security.utils import json

security_bp = Blueprint("security")


@security_bp.post("api/register")
async def on_register(request):
    account = await register(request, True)
    response = json("Registration successful!", account.json())
    return response


@security_bp.post("api/login")
async def on_login(request):
    authentication_session = await login(request)
    response = json("Login successful!", authentication_session.bearer.json())
    authentication_session.encode(response)
    return response


@security_bp.post("api/logout")
async def on_logout(request):
    authentication_session = await logout(request)
    response = json("Logout successful!", authentication_session.bearer.json())
    return response
