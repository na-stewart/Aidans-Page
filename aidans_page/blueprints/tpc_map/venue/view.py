from sanic import Blueprint
from sanic_security.authorization import require_permissions
from sanic_security.utils import json

from model import Venue

venue_bp = Blueprint("Venue")


# TODO: Field validation.

@venue_bp.post("venue")
@require_permissions("venue:create")
async def on_venue_create(request):
    venue = await Venue.create(
        name=request.form.get("name"),
        summary=request.form.get("summary"),
        reception=request.form.get("reception"),
        seated=request.form.get("seated"),
        neighborhood=request.form.get("neighborhood"),
        type=request.form.get("type"),
        coordinates=request.form.get("coordinates"),
        thumbnail_url=request.form.get("thumbnail_url"),
        redirect_url=request.form.get("redirect_url"),
        available=request.form.get("available") is not None,
    )
    return json("Venue created.", venue.json)


@venue_bp.put("venue")
@require_permissions("venue:update")
async def on_entry_update(request):
    venue = await Venue.get(id=request.args.get("id"))
    venue.name = request.form.get("name")
    venue.summary = request.form.get("summary")
    venue.reception = request.form.get("reception")
    venue.seated = request.form.get("seated")
    venue.neighborhood = request.form.get("neighborhood")
    venue.type = request.form.get("type")
    venue.coordinates = request.form.get("coordinates")
    venue.thumbnail_url = request.form.get("thumbnail_url")
    venue.redirect_url = request.form.get("redirect_url")
    venue.visible = request.form.get("visible") is not None
    await venue.save(
        update_fields=["name", "summary", "reception", "seated", "neighborhood", "type", "coordinates", "thumbnail_url",
                       "redirect_url", "visible"]
    )
    return json("Venue updated.", venue.json)


@venue_bp.get("venue/all/visible")
async def on_venue_get_all_available(request):
    venues = await Venue.filter(deleted=False, visible=True).all()
    return json("Venues retrieved.", [inquiry.json for inquiry in venues])


@venue_bp.get("venue/all")
@require_permissions("venue:get")
async def on_venue_get_all(request):
    venues = await Venue.filter(deleted=False).all()
    return json("Venues retrieved.", [inquiry.json for inquiry in venues])


@venue_bp.delete("venue")
@require_permissions("venue:delete")
async def on_inquiry_delete(request):
    venue = await Venue.get(id=request.args.get("id"))
    venue.deleted = True
    await venue.save(update_fields=["deleted"])
    return json("Venue deleted.", venue.json)
