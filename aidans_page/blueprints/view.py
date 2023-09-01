from sanic import Blueprint

from aidans_page.blueprints.blog.comment.view import comment_bp
from aidans_page.blueprints.blog.entry.view import entry_bp

from aidans_page.blueprints.inquiry.view import inquiry_bp
from aidans_page.blueprints.security.account.view import account_bp
from aidans_page.blueprints.security.view import security_bp
from aidans_page.blueprints.tpc_map.venue.view import venue_bp

bp_models = [
    "aidans_page.blueprints.blog.entry.model",
    "aidans_page.blueprints.inquiry.model",
    "aidans_page.blueprints.blog.comment.model",
    "aidans_page.blueprints.tpc_map.venue.model",
]
api = Blueprint.group(
    security_bp,
    entry_bp,
    account_bp,
    inquiry_bp,
    comment_bp,
    venue_bp,
    version=1,
    version_prefix="/api/v",
)
