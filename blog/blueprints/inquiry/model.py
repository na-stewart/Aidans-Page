from tortoise import fields

from blog.common.base_model import BaseModel


class Inquiry(BaseModel):
    name: str = fields.CharField(max_length=255)
    email: str = fields.CharField(max_length=255)
    message: str = fields.TextField()

    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "date_created": str(self.date_created),
            "date_updated": str(self.date_updated),
            "name": self.name,
            "email": self.email,
            "message": self.message,
        }
