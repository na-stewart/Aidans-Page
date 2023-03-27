from sanic import Blueprint
from sanic_security.authorization import require_permissions
from sanic_security.utils import json

from blog.blueprints.tag.model import Tag

tag_bp = Blueprint("Tag")


@tag_bp.post("tag")
@require_permissions("tag:post")
async def on_tag_create(request):
    tag = await Tag.create(name=request.json.get("name"))
    return json("Tag created.", tag.json)


@tag_bp.get("tag")
@require_permissions("tag:get")
async def on_tag_get(request):
    tag = await Tag.get(id=request.args.get("id"), deleted=False)
    return json("Tag retrieved.", tag.json)


@tag_bp.get("tag/all")
async def on_tag_get_all(request):
    tags = await Tag.filter(deleted=False).all()
    return json("Tags retrieved.", [tag.json for tag in tags])
