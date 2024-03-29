from sanic_security.models import BaseModel
from tortoise import fields


class Inquiry(BaseModel):
    username: str = fields.CharField(max_length=255)
    email: str = fields.CharField(max_length=255)
    content: str = fields.TextField()

    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "date_created": str(self.date_created),
            "date_updated": str(self.date_updated),
            "username": self.username,
            "email": self.email,
            "content": self.content,
        }
