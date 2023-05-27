from sanic import Blueprint
from sanic_security.authorization import require_permissions
from sanic_security.utils import json
from sanic_security.verification import requires_captcha

from blog.blueprints.inquiry.model import Inquiry

inquiry_bp = Blueprint("Inquiry")


@inquiry_bp.post("inquiry")
@requires_captcha()
async def on_inquiry_create(request):
    inquiry = await Inquiry.create(email=request.form.get("email"), username=request.form.get("username"),
                                   content=request.form.get("content"))
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
