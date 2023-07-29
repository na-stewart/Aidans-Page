from sanic import Blueprint

from blog.blueprints.comment.view import comment_bp
from blog.blueprints.entry.view import entry_bp
from blog.blueprints.account.view import account_bp
from blog.blueprints.inquiry.view import inquiry_bp
from blog.blueprints.security.view import security_bp

bp_models = [
    "blog.blueprints.entry.model",
    "blog.blueprints.inquiry.model",
    "blog.blueprints.account.model",
    "blog.blueprints.comment.model",
]
api = Blueprint.group(
    security_bp, entry_bp, account_bp, inquiry_bp, comment_bp, version=1, version_prefix="/api/v"
)
