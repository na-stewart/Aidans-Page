import argon2
from argon2 import PasswordHasher
from sanic import Blueprint
from sanic_security.authentication import requires_authentication
from sanic_security.utils import json

profile_bp = Blueprint("profile")
password_hasher = PasswordHasher()


@profile_bp.get("profile")
@requires_authentication()
async def on_profile_get(request, authentication_request):
    return json("Profile retrieved.", authentication_request.bearer.json)


@profile_bp.put("profile")
@requires_authentication()
async def on_profile_update(request, authentication_request):
    authentication_request.bearer.username = request.form.get("username")
    authentication_request.bearer.email = request.form.get("email")
    if request.form.get("password"):
        authentication_request.bearer.password = password_hasher.hash(request.form.get("password"))
    await authentication_request.bearer.save(update_fields=["username", "email", "password"])
    return json("Profile updated.", authentication_request.bearer.json)
