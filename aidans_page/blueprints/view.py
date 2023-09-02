from sanic import Blueprint

from aidans_page.blueprints.comment.view import comment_bp
from aidans_page.blueprints.entry.view import entry_bp

from aidans_page.blueprints.inquiry.view import inquiry_bp
from aidans_page.blueprints.security.account.view import account_bp
from aidans_page.blueprints.security.view import security_bp

api_models = [
    "sanic_security.models",
    "aidans_page.blueprints.entry.model",
    "aidans_page.blueprints.inquiry.model",
    "aidans_page.blueprints.comment.model",
]
api = Blueprint.group(
    security_bp,
    entry_bp,
    account_bp,
    inquiry_bp,
    comment_bp,
    version=1,
    version_prefix="/api/v",
)
