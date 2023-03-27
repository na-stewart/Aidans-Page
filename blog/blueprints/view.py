from sanic import Blueprint

from blog.blueprints.entry.view import entry_bp
from blog.blueprints.security.view import security_bp
from blog.blueprints.tag.view import tag_bp

bp_models = ["blog.blueprints.entry.model", "blog.blueprints.tag.model"]
api = Blueprint.group(security_bp, tag_bp, entry_bp, version=1, version_prefix="/api/v")
