from sanic import Blueprint

from aidans_page.blueprints.blog.comment.view import comment_bp
from aidans_page.blueprints.blog.entry.view import entry_bp
from aidans_page.blueprints.account.view import account_bp
from aidans_page.blueprints.blog.view import blog_bp
from aidans_page.blueprints.inquiry.view import inquiry_bp
from aidans_page.blueprints.security.view import security_bp

bp_models = [
    "aidans_page.blueprints.blog.entry.model",
    "aidans_page.blueprints.inquiry.model",
    "aidans_page.blueprints.blog.comment.model",
]
api = Blueprint.group(
    security_bp,
    blog_bp,
    entry_bp,
    account_bp,
    inquiry_bp,
    comment_bp,
    version=1,
    version_prefix="/api/v",
)
