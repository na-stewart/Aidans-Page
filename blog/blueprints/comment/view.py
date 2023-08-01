from math import ceil

from sanic import Blueprint
from sanic_security.authentication import requires_authentication
from sanic_security.authorization import require_permissions
from sanic_security.utils import json

from blog.blueprints.comment.model import Comment
from blog.blueprints.entry.model import Entry

comment_bp = Blueprint("Comment")

comment_bp.static(
    "/dashboard/comment", "blog/static/dashboard/comment.html", name="dashboard_comment/"
)


@comment_bp.post("comment")
@require_permissions("comment:post")
async def on_comment_create(request):
    entry = await Entry.get(id=request.form.get("entry"))
    comment = await Comment.create(
        content=request.form.get("content"),
        author=request.ctx.authentication_session.bearer,
        entry=entry,
        approved=request.form.get("approved") is not None
    )
    return json("Comment created.", comment.json)


@comment_bp.post("comment/publish")
@requires_authentication
async def on_comment_publish(request):
    entry = await Entry.get(id=request.args.get("entry"))
    comment = await Comment.create(
        content=request.form.get("content"),
        author=request.ctx.authentication_session.bearer,
        entry=entry,
    )
    return json("Comment created.", comment.json)


@comment_bp.get("comment/all/approved")
async def on_comment_get_all_approved(request):
    page = (
        1
        if request.args.get("page") in (None, "null")
        else int(request.args.get("page"))
    )
    comments_query = (
        Comment.filter(deleted=False, approved=True, entry_id=request.args.get("entry"))
        .order_by("-date_created")
        .prefetch_related("author")
        .all()
    )
    total_comments = await comments_query.count()
    return json(
        "Comments retrieved.",
        {
            "total_pages": ceil(total_comments / 10),
            "total_comments": total_comments,
            "comments": [
                comment.json
                for comment in await comments_query.offset((page - 1) * 10).limit(10)
            ],
        },
    )


@comment_bp.get("comment/all")
@require_permissions("comment:get")
async def on_comment_get_all(request):
    comments = await Comment.filter(deleted=False).prefetch_related("author", "entry").all()
    return json("comment retrieved.", [comment.json for comment in comments])


@comment_bp.put("comment")
@require_permissions("comment:put")
async def on_comment_update(request):
    comment = await Comment.get(id=request.args.get("id")).prefetch_related("entry", "author")
    comment.approved = request.form.get("approved") is not None
    comment.content = request.form.get("content")
    comment.entry_id = request.form.get("entry")
    await comment.save(update_fields=["approved", "content", "entry_id"])
    return json("Entry updated.", comment.json)


@comment_bp.delete("comment")
@require_permissions("comment:delete")
async def on_comment_delete(request):
    comment = await Comment.get(id=request.args.get("id"))
    comment.deleted = True
    await comment.save(update_fields=["deleted"])
    return json("Comment deleted.", comment.json)
