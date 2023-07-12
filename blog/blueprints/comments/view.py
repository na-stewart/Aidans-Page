from math import ceil

from sanic import Blueprint
from sanic_security.authentication import requires_authentication
from sanic_security.authorization import require_permissions
from sanic_security.utils import json

from blog.blueprints.comments.model import Comment
from blog.blueprints.entry.model import Entry
from blog.blueprints.inquiry.model import Inquiry
from blog.common.util import get_page_from_args

comment_bp = Blueprint("Comment")


@comment_bp.post("comment")
@require_permissions("comment:create")
async def on_comment_create(request):
    account = await Entry.get(id=request.form.get("account-id"))
    comment = await Comment.create(
        content=request.form.get("content"),
        account=account.id,
    )
    return json("Comment created.", comment.json)


@comment_bp.post("comment/entry")
@requires_authentication()
async def on_entry_comment_create(request):
    comment = await Comment.create(
        content=request.form.get("content"),
        account=request.ctx.authentication_session.bearer
    )
    return json("Comment created.", comment.json)


@comment_bp.get("comment/entry")
async def on_entry_comment_get(request):
    page = get_page_from_args(request)
    comments_query = (
        Comment.filter(deleted=False)
        .order_by("-date_created")
        .all()
    )
    return json(
        "Entries retrieved.",
        {
            "total_pages": ceil(await comments_query.count() / 10),
            "entries": [
                entry.json
                for entry in await comments_query.offset((page - 1) * 10).limit(10)
            ],
        },
    )


@comment_bp.get("comment/all")
@require_permissions("comment:get")
async def on_comment_get_all(request):
    inquiries = await Inquiry.filter(deleted=False).all()
    return json("Inquiries retrieved.", [inquiry.json for inquiry in inquiries])


@comment_bp.delete("comment")
@require_permissions("comment:delete")
async def on_comment_delete(request):
    comment = await Comment.get(id=request.args.get("id"))
    comment.deleted = True
    await comment.save(update_fields=["deleted"])
    return json("Comment deleted.", comment.json)
