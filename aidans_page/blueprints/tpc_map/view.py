from sanic import Blueprint

tpc_map_bp = Blueprint("Tpc")

tpc_map_bp.static("/tpc-map", "aidans_page/static/tpc-map/index.html", name="tpc_map_index")