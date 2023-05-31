from sanic_security.models import Account
from tortoise import fields

from blog.common.base_model import BaseModel


class Profile(BaseModel):
    parent: fields.ForeignKeyRelation["Account"] = fields.ForeignKeyField(
        "models.Account"
    )
    subscribed: bool = fields.BooleanField(default=False)

    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "date_created": str(self.date_created),
            "date_updated": str(self.date_updated),
            "parent": self.parent.email if isinstance(self.parent, Account) else None,
            "subscribed": self.subscribed,
        }
