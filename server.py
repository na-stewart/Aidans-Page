from sanic import Sanic
from tortoise.contrib.sanic import register_tortoise

from blog.blueprints.view import api, bp_models
from blog.common.config import config

app = Sanic("Blog")

app.blueprint(api)

app.static("/", "blog/static")
app.static("/", "blog/static/index.html")

register_tortoise(
    app,
    db_url=config.DATABASE_URL,
    modules={"models": ["sanic_security.models"] + bp_models},
    generate_schemas=True,
)
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, workers=1)
