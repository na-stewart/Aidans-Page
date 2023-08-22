from argon2 import PasswordHasher
from sanic import Blueprint
from sanic_security.authentication import (
    requires_authentication,
    validate_email,
    validate_username,
    validate_password,
)
from sanic_security.authorization import require_permissions
from sanic_security.models import Account
from sanic_security.utils import json

from blog.blueprints.account.model import Profile

account_bp = Blueprint("account")
password_hasher = PasswordHasher()

account_bp.static(
    "/dashboard/account", "blog/static/dashboard/account.html", name="dashboard_account"
)
account_bp.static(
    "/dashboard/profile", "blog/static/dashboard/profile.html", name="dashboard_profile"
)


@account_bp.get("account")
@requires_authentication
async def on_account_get(request):
    return json("Account retrieved.", request.ctx.authentication_session.bearer.json)


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
    await Profile.create(account=account)
    return json("Account created.", account.json)


@account_bp.delete("account")
@require_permissions("account:delete")
async def on_account_delete(request):
    account = await Account.get(id=request.args.get("id"))
    profile = await Profile.get(account=account)
    profile.deleted = True
    account.deleted = True
    await profile.save(update_fields=["deleted"])
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
        account.password = password_hasher.hash(
            validate_password(request.form.get("password"))
        )
    await account.save(update_fields=["username", "email", "password", "disabled", "verified"])
    return json("Profile updated.", account.json)


@account_bp.get("profile/all")
@require_permissions("profile:get")
async def on_profile_get_all(request):
    profiles = await Profile.filter(deleted=False).prefetch_related("account").all()
    return json("Profiles retrieved.", [profile.json for profile in profiles])


@account_bp.put("profile")
@require_permissions("profile:put")
async def on_profile_update(request):
    profile = await Profile.get(id=request.args.get("id")).prefetch_related("account")
    profile.subscribed = request.form.get("subscribed") is not None
    await profile.save(update_fields=["subscribed"])
    return json("Profile updated.", profile.json)


@account_bp.get("account/profile")
@requires_authentication
async def on_account_profile_get(request):
    profile = await Profile.get_or_none(
        account=request.ctx.authentication_session.bearer
    )
    return json(
        "Profile retrieved.",
        {
            "account": request.ctx.authentication_session.bearer.json,
            "profile": profile.json if profile else None,
        },
    )


@account_bp.delete("account/profile")
@requires_authentication
async def on_account_profile_delete(request):
    profile = await Profile.get(account=request.ctx.authentication_session.bearer)
    profile.deleted = True
    request.ctx.authentication_session.bearer.deleted = True
    await request.ctx.authentication_session.bearer.save(update_fields=["deleted"])
    await profile.save(update_fields=["deleted"])
    return json("Account deleted.", request.ctx.authentication_session.bearer.json)


@account_bp.put("account/profile")
@requires_authentication
async def on_account_profile_update(request):
    profile = await Profile.get(account=request.ctx.authentication_session.bearer)
    profile.subscribed = request.form.get("subscribed") is not None
    request.ctx.authentication_session.bearer.username = request.form.get("username")
    request.ctx.authentication_session.bearer.email = request.form.get("email")
    if request.form.get("password"):
        request.ctx.authentication_session.bearer.password = password_hasher.hash(
            validate_password(request.form.get("password"))
        )
    await profile.save(update_fields=["subscribed"])
    await request.ctx.authentication_session.bearer.save(
        update_fields=["username", "email", "password"]
    )
    return json("Profile updated.", request.ctx.authentication_session.bearer.json)
