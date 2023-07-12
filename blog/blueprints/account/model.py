from sanic_security.models import Account
from tortoise import fields

from blog.common.base_model import BaseModel
from blog.common.util import model_prefetched_or_none


class Profile(BaseModel):
    account: fields.ForeignKeyRelation["Account"] = fields.ForeignKeyField(
        "models.Account"
    )
    subscribed: bool = fields.BooleanField(default=True)

    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "date_created": str(self.date_created),
            "date_updated": str(self.date_updated),
            "account": model_prefetched_or_none(self.account).email,
            "subscribed": self.subscribed,
        }
