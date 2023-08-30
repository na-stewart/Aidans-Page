import datetime

from tortoise import fields, Model


class BaseModel(Model):
    id: int = fields.IntField(pk=True)
    date_created: datetime.datetime = fields.DatetimeField(auto_now_add=True)
    date_updated: datetime.datetime = fields.DatetimeField(auto_now=True)
    deleted: bool = fields.BooleanField(default=False)

    @property
    def json(self) -> dict:
        raise NotImplementedError()

    class Meta:
        abstract = True
