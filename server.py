from sanic import Sanic

from blog.blueprints.security.view import security_bp

app = Sanic("DriveTheVote")

app.blueprint(security_bp)

app.static("/", "./resources/static")
app.static("/", "./resources/static/login.html")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, workers=1)

