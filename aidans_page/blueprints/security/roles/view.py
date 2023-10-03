from sanic import Blueprint
from sanic_security.authorization import require_permissions
from sanic_security.models import Role
from sanic_security.utils import json

roles_bp = Blueprint("Role")

roles_bp.static(
    "/dashboard/roles",
    "aidans_page/static/dashboard/roles.html",
    name="dashboard_role",
)


@roles_bp.post("role")
@require_permissions("role:create")
async def on_role_create(request):
    role = await Role.create(
        name=request.form.get("name"),
        description=request.form.get("description"),
        permissions=request.form.get("permissions"),
    )
    return json("Role created.", role.json)


@roles_bp.get("role/all")
@require_permissions("role:get")
async def on_role_get_all(request):
    role = await Role.filter(deleted=False).all()
    return json("Roles retrieved.", [role.json for role in role])


@roles_bp.delete("role")
@require_permissions("role:delete")
async def on_role_delete(request):
    role = await Role.get(id=request.args.get("id"))
    role.deleted = True
    await role.save(update_fields=["deleted"])
    return json("Role deleted.", role.json)
