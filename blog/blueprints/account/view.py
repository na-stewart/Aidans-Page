from argon2 import PasswordHasher
from sanic import Blueprint
from sanic_security.authentication import requires_authentication
from sanic_security.authorization import require_permissions
from sanic_security.models import Account
from sanic_security.utils import json

account_bp = Blueprint("account")
password_hasher = PasswordHasher()


@account_bp.get("account/all")
@require_permissions("entry:get")
async def on_account_get_all(request, authentication_session):
    accounts = await Account.filter(deleted=False).all()
    return json("Accounts retrieved.", [account.json for account in accounts])


# A profile is information available to a logged in account

@account_bp.delete("account/profile")
@requires_authentication()
async def on_profile_delete(request, authentication_request):
    authentication_request.bearer.deleted = True
    await authentication_request.bearer.save(update_fields=["deleted"])
    return json("Account deleted.", authentication_request.bearer.json)


@account_bp.get("account/profile")
@requires_authentication()
async def on_profile_get(request, authentication_request):
    return json("Profile retrieved.", authentication_request.bearer.json)


@account_bp.put("account/profile")
@requires_authentication()
async def on_profile_update(request, authentication_request):
    authentication_request.bearer.username = request.form.get("username")
    authentication_request.bearer.email = request.form.get("email")
    await authentication_request.bearer.save(update_fields=["username", "email"])
    return json("Profile updated.", authentication_request.bearer.json)
