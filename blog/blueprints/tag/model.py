from tortoise import fields
from blog.common.base_model import BaseModel


class Tag(BaseModel):
    name: str = fields.CharField(unique=True, max_length=255)

    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "date_created": str(self.date_created),
            "date_updated": str(self.date_updated),
            "name": self.name,
        }
