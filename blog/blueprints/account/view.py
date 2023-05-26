from argon2 import PasswordHasher
from sanic import Blueprint
from sanic_security.authentication import requires_authentication, validate_email, validate_username, validate_password
from sanic_security.authorization import require_permissions
from sanic_security.models import Account
from sanic_security.utils import json

account_bp = Blueprint("account")
password_hasher = PasswordHasher()


@account_bp.get("account/all")
@require_permissions("account:get")
async def on_account_get_all(request):
    accounts = await Account.filter(deleted=False).all()
    return json("Accounts retrieved.", [account.json for account in accounts])


@account_bp.post("account")
@require_permissions("account:post")
async def on_account_create(request):
    account = await Account.create(
        email=validate_email(request.form.get("email")),
        username=validate_username(request.form.get("username")),
        password=password_hasher.hash(validate_password(request.form.get("password"))),
        verified=request.form.get("verified") is not None,
        disabled=request.form.get("disabled") is not None,
    )
    return json("Account created.", account.json)


@account_bp.delete("account")
@require_permissions("account:delete")
async def on_account_delete(request):
    account = await Account.get(id=request.args.get("id"))
    account.deleted = True
    await account.save(update_fields=["deleted"])
    return json("Account deleted.", account.json)


@account_bp.put("account")
@require_permissions("account:put")
async def on_account_update(request):
    account = await Account.get(id=request.args.get("id"))
    account.username = validate_username(request.form.get("username"))
    account.email = validate_email(request.form.get("email"))
    account.disabled = request.form.get("disabled") is not None
    account.verified = request.form.get("verified") is not None
    if request.form.get("password"):
        account.password = password_hasher.hash(validate_password(request.form.get("password")))
    await account.save(update_fields=["username", "email", "password"])
    return json("Profile updated.", account.json)


# A profile are resources of an account a logged-in user can access.

@account_bp.delete("account/profile")
@requires_authentication()
async def on_profile_delete(request):
    # Endpoint for users who are logged in to delete their account.
    request.ctx.authentication_request.bearer.deleted = True
    await request.ctx.authentication_request.bearer.save(update_fields=["deleted"])
    return json("Account deleted.", request.ctx.authentication_request.bearer.json)


@account_bp.get("account/profile")
@requires_authentication()
async def on_profile_get(request):
    return json("Profile retrieved.", request.ctx.authentication_request.bearer.json)


@account_bp.put("account/profile")
@requires_authentication()
async def on_profile_update(request):
    request.ctx.authentication_request.bearer.username = request.form.get("username")
    request.ctx.authentication_request.bearer.email = request.form.get("email")
    await request.ctx.authentication_request.bearer.save(update_fields=["username", "email"])
    return json("Profile updated.", request.ctx.authentication_request.bearer.json)
