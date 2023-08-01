from math import ceil

from sanic import Blueprint
from sanic_security.authorization import require_permissions
from sanic_security.utils import json
from tortoise.expressions import Q

from blog.blueprints.entry.model import Entry

entry_bp = Blueprint("Entry")

entry_bp.static(
    "/dashboard/entry", "blog/static/dashboard/entry.html", name="dashboard_entry"
)
entry_bp.static("/entry", "blog/static/blog/entry.html", name="blog_entry")


@entry_bp.post("entry")
@require_permissions("entry:post")
async def on_entry_create(request):
    entry = await Entry.create(
        title=request.form.get("title"),
        summary=request.form.get("summary"),
        content=request.form.get("content"),
        thumbnail_url=request.form.get("thumbnail-url"),
        published=request.form.get("published") is not None,
        author=request.ctx.authentication_session.bearer,
    )
    return json("Entry created.", entry.json)


@entry_bp.put("entry")
@require_permissions("entry:put")
async def on_entry_update(request):
    entry = await Entry.get(id=request.args.get("id"))
    entry.title = request.form.get("title")
    entry.summary = request.form.get("summary")
    entry.content = request.form.get("content")
    entry.thumbnail_url = request.form.get("thumbnail-url")
    entry.published = request.form.get("published") is not None
    await entry.save(
        update_fields=["title", "summary", "content", "thumbnail_url", "published"]
    )
    return json("Entry updated.", entry.json)


@entry_bp.get("entry/all/published")
async def on_entry_get_all_published(request):
    filter_query = Q(deleted=False, published=True)
    if request.args.get("search") not in (None, "null", ""):
        filter_query = filter_query & (
            Q(title__icontains=request.args.get("search"))
            | Q(summary__icontains=request.args.get("search"))
        )
    page = (
        1
        if request.args.get("page") in (None, "null")
        else int(request.args.get("page"))
    )
    entries_query = (
        Entry.filter(filter_query)
        .only(
            "date_created",
            "id",
            "title",
            "summary",
            "published",
            "thumbnail_url",
            "author_id",
        )
        .order_by("-date_created")
        .prefetch_related("author")
        .all()
    )
    return json(
        "Entries retrieved.",
        {
            "total_pages": ceil(await entries_query.count() / 6),
            "entries": [
                entry.json
                for entry in await entries_query.offset((page - 1) * 6).limit(6)
            ],
        },
    )


@entry_bp.get("entry/published")
async def on_entry_get_published(request):
    entry = await Entry.get(id=request.args.get("id"), deleted=False, published=True)
    return json("Entry retrieved.", entry.json)


@entry_bp.get("entry")
@require_permissions("entry:get")
async def on_entry_get(request):
    entry = await Entry.get(id=request.args.get("id"), deleted=False)
    return json("Entry retrieved.", entry.json)


@entry_bp.get("entry/all")
@require_permissions("entry:get")
async def on_entry_get_all(request):
    entries = await Entry.filter(deleted=False).all()
    return json("Entries retrieved.", [entry.json for entry in entries])


@entry_bp.delete("entry")
@require_permissions("entry:delete")
async def on_entry_delete(request):
    entry = await Entry.get(id=request.args.get("id"))
    entry.deleted = True
    await entry.save(update_fields=["deleted"])
    return json("Entry deleted.", entry.json)
