from math import ceil

from sanic import Blueprint
from sanic.utils import str_to_bool
from sanic_security.authorization import require_permissions
from sanic_security.utils import json

from blog.blueprints.entry.model import Entry
from blog.blueprints.tag.model import Tag

entry_bp = Blueprint("Entry")


@entry_bp.post("entry")
@require_permissions("entry:post")
async def on_entry_create(request, authentication_session):
    entry = await Entry.create(
        title=request.json.get("title"),
        summary=request.json.get("summary"),
        content=request.json.get("content"),
        thumbnail_url=request.json.get("thumbnail_url"),
        author=authentication_session.bearer,
        published=str_to_bool(request.json.get("published")),
    )
    for tag_id in request.json.get("tags"):
        tag = await Tag.get(id=tag_id, deleted=False)
        await entry.tags.add(tag)
    await entry.fetch_related("tags")
    return json("Entry created.", entry.json)


@entry_bp.get("entry/all/published")
async def on_entry_get_all_published(request):
    entries_per_page = 6
    total_entries = await Entry.all().count()
    page = 1 if request.args.get("page") in (None, "null") else int(request.args.get("page"))
    offset = (page - 1) * entries_per_page
    entries = (
        await Entry.filter(deleted=False, published=True)
        .all()
        .prefetch_related("author", "tags")
        .offset(offset)
        .limit(entries_per_page)
    )
    return json(
        "Entries retrieved.",
        {
            "total_pages": ceil(total_entries / entries_per_page),
            "entries": [entry.json for entry in entries],
        },
    )


@entry_bp.get("entry/published")
async def on_entry_get_published(request):
    entry = await Entry.get(
        id=request.args.get("id"), deleted=False, published=True
    ).prefetch_related("tags", "author")
    return json("Entry retrieved.", entry.json)


@entry_bp.get("entry")
@require_permissions("entry:get")
async def on_entry_get(request, authentication_session):
    entry = await Entry.get(id=request.args.get("id"), deleted=False).prefetch_related(
        "tags", "author"
    )
    return json("Entry retrieved.", entry.json)


@entry_bp.get("entry/all")
@require_permissions("entry:get")
async def on_entry_get_all(request, authentication_session):
    entries = await Entry.filter(deleted=False).prefetch_related("tags", "author").all()
    return json("Entries retrieved.", [entry.json for entry in entries])
