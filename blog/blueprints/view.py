from sanic import Blueprint

from blog.blueprints.entry.view import entry_bp
from blog.blueprints.profile.view import profile_bp
from blog.blueprints.security.view import security_bp

bp_models = ["blog.blueprints.entry.model"]
api = Blueprint.group(security_bp, entry_bp, profile_bp, version=1, version_prefix="/api/v")
