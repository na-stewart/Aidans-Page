from sanic import Blueprint
from sanic_security.authentication import register, login, logout
from sanic_security.exceptions import UnverifiedError
from sanic_security.utils import json
from sanic_security.verification import (
    requires_captcha,
    request_captcha,
    request_two_step_verification,
    verify_account,
)

from blog.common.util import send_email

security_bp = Blueprint("security")


@security_bp.post("register")
@requires_captcha()
async def on_register(request, captcha_session):
    account = await register(request)
    two_step_session = await request_two_step_verification(request, account)
    await send_email(
        account.email,
        "Two-step Verification",
        f"Your verification code is: {two_step_session.code}",
    )
    response = json(
        "Registration successful! Verification required.",
        two_step_session.bearer.json,
    )
    two_step_session.encode(response)
    return response


@security_bp.post("verify-email")
async def on_verify(request):
    two_step_session = await verify_account(request)
    return json(
        "You have verified your email and may login!", two_step_session.bearer.json
    )


@security_bp.get("/captcha")
async def on_captcha_img_request(request):
    captcha_session = await request_captcha(request)
    response = captcha_session.get_image()
    captcha_session.encode(response)
    return response


@security_bp.post("/login")
async def on_login(request):
    try:
        authentication_session = await login(request)
        response = json("Login successful.", authentication_session.bearer.json)
        authentication_session.encode(response)
    except UnverifiedError as e:
        two_step_session = await request_two_step_verification(request)
        await send_email(
            two_step_session.bearer.email,
            "Two-step Verification",
            f"Your verification code is: {two_step_session.code}",
        )
        two_step_session.encode(e.json)
        raise e
    return response


@security_bp.post("/logout")
async def on_logout(request):
    authentication_session = await logout(request)
    response = json("Logout successful.", authentication_session.bearer.json)
    return response
