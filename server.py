import traceback

from sanic import Sanic, text
from sanic_security.authentication import create_initial_admin_account
from sanic_security.utils import json
from tortoise.contrib.sanic import register_tortoise

from aidans_page.blueprints.view import api, bp_models
from aidans_page.common.config import config

app = Sanic("Blog")

app.blueprint(api)

# Update once general index is created.
app.static("/", "aidans_page/static/blog/index.html", name="blog_index")
app.static("/", "aidans_page/static", name="aidans_page_static")


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
