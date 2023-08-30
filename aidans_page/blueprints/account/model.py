from sanic_security.models import Account
from tortoise import fields

from aidans_page.common.base_model import BaseModel


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
            "account": self.account.email
            if isinstance(self.account, Account)
            else None,
            "subscribed": self.subscribed,
        }
