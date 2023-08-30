from sanic import Blueprint
from sanic_security.authorization import require_permissions
from sanic_security.utils import json
from sanic_security.verification import requires_captcha

from aidans_page.blueprints.inquiry.model import Inquiry
from aidans_page.common.config import config
from aidans_page.common.util import send_email

inquiry_bp = Blueprint("Inquiry")

inquiry_bp.static(
    "/dashboard/inquiry", "aidans_page/static/dashboard/inquiry.html", name="dashboard_inquiry"
)


@inquiry_bp.post("inquiry")
@requires_captcha()
async def on_inquiry_create(request):
    inquiry = await Inquiry.create(
        email=request.form.get("email"),
        username=request.form.get("username"),
        content=request.form.get("content"),
    )
    await send_email(config.ADMIN_EMAIL, "New Inquiry", inquiry.json)
    return json("Inquiry created.", inquiry.json)


@inquiry_bp.get("inquiry/all")
@require_permissions("inquiry:get")
async def on_inquiry_get_all(request):
    inquiries = await Inquiry.filter(deleted=False).all()
    return json("Inquiries retrieved.", [inquiry.json for inquiry in inquiries])


@inquiry_bp.delete("inquiry")
@require_permissions("inquiry:delete")
async def on_inquiry_delete(request):
    inquiry = await Inquiry.get(id=request.args.get("id"))
    inquiry.deleted = True
    await inquiry.save(update_fields=["deleted"])
    return json("Inquiry deleted.", inquiry.json)
