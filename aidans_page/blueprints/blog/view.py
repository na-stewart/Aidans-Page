from sanic import Blueprint

blog_bp = Blueprint("blog")

blog_bp.static("/blog", "aidans_page/static/blog/index.html", name="blog_index")
blog_bp.static("/blog/about", "aidans_page/static/blog/about.html", name="blog_about")
blog_bp.static("/blog/contact", "aidans_page/static/blog/contact.html", name="blog_contact")
blog_bp.static("/blog/profile", "aidans_page/static/blog/profile.html", name="blog_profile")