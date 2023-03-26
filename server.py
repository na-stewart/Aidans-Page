from sanic import Sanic
from sanic.exceptions import SanicException
from sanic_security.authentication import create_initial_admin_account
from sanic_security.utils import json
from tortoise.contrib.sanic import register_tortoise

from blog.blueprints.view import api, bp_models
from blog.common.config import config

app = Sanic("Blog")

app.blueprint(api)

app.static("/", "blog/static")
app.static("/login", "blog/static/auth/index.html")
app.static("/register", "blog/static/auth/register.html")


@app.exception(SanicException)
async def exception_parser(request, e):
    return json(str(e), e.__class__.__name__, e.status_code)


register_tortoise(
    app,
    db_url=config.DATABASE_URL,
    modules={"models": ["sanic_security.models"] + bp_models},
    generate_schemas=True,
)
create_initial_admin_account(app)
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, workers=1, debug=True)

