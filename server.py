import traceback

from sanic import Sanic, text
from sanic_security.authentication import create_initial_admin_account
from sanic_security.utils import json
from tortoise.contrib.sanic import register_tortoise

from aidans_page.blueprints.view import api, bp_models
from aidans_page.common.config import config

app = Sanic("Blog")

app.blueprint(api)

app.static("/", "aidans_page/static/blog/index.html", name="aidans_page_index")
app.static("/", "aidans_page/static", name="aidans_page_static")

app.static("/blog", "aidans_page/static/blog/index.html", name="blog_index")
app.static("/blog/about", "aidans_page/static/blog/about.html", name="blog_about")
app.static("/blog/contact", "aidans_page/static/blog/contact.html", name="blog_contact")
app.static("/blog/profile", "aidans_page/static/blog/profile.html", name="blog_profile")

app.static("/tpc-map", "aidans_page/static/tpc-map/index.html", name="tpc_map_index")


@app.get("/test")
async def get_build(request):
    return text(config.APP_BUILD)


@app.exception(Exception)
async def exception_parser(request, e):
    traceback.print_exc()
    return json(
        str(e),
        e.__class__.__name__,
        e.status_code if hasattr(e, "status_code") else 500,
    )


app.config.PROXIES_COUNT = 1
register_tortoise(
    app,
    db_url=config.DATABASE_URL,
    modules={"models": ["sanic_security.models"] + bp_models},
    generate_schemas=True,
)
create_initial_admin_account(app)
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, workers=1, debug=True)
