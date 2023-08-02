from sanic_security.models import Account
from tortoise import fields

from blog.blueprints.entry.model import Entry
from blog.common.base_model import BaseModel


class Comment(BaseModel):
    content: str = fields.TextField()
    entry: fields.ForeignKeyRelation["Entry"] = fields.ForeignKeyField("models.Entry")
    author: fields.ForeignKeyRelation["Account"] = fields.ForeignKeyField(
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
            "author": self.author.username
            if isinstance(self.author, Account)
            else None,
            "entry": self.entry.id if isinstance(self.entry, Entry) else None,
            "entry_title": self.entry.title if isinstance(self.entry, Entry) else None,
            "approved": self.approved,
        }
