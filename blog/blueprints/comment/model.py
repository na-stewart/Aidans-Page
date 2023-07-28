from sanic_security.models import Account
from tortoise import fields

from blog.blueprints.entry.model import Entry
from blog.common.base_model import BaseModel
from blog.common.util import model_prefetched_or_none


class Comment(BaseModel):
    content: str = fields.CharField(max_length=255)
    entry: fields.ForeignKeyRelation["Entry"] = fields.ForeignKeyField("models.Entry")
    account: fields.ForeignKeyRelation["Account"] = fields.ForeignKeyField(
        "models.Account"
    )
    approved: bool = fields.BooleanField(default=False)

    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "date_created": str(self.date_created),
            "date_updated": str(self.date_updated),
            "content": self.content,
            "account": model_prefetched_or_none(self.account).username,
            "entry": model_prefetched_or_none(self.entry).id,
        }
