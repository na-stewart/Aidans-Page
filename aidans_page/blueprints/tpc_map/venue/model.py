from tortoise import fields

from aidans_page.common.base_model import BaseModel


class Venue(BaseModel):
    name: str = fields.CharField(unique=True, max_length=255)
    summary: str = fields.CharField(max_length=255)
    reception: int = fields.IntField()
    seated: int = fields.IntField()
    neighborhood: str = fields.CharField(max_length=255)
    type: str = fields.CharField(max_length=255)
    coordinates: str = fields.CharField(max_length=255)
    thumbnail_url: str = fields.CharField(max_length=255)
    redirect_url: str = fields.CharField(max_length=255)
    available: bool = fields.BooleanField(default=True)

    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "date_created": str(self.date_created),
            "date_updated": str(self.date_updated),
            "name": self.name,
            "summary": self.summary,
            "reception": self.reception,
            "seated": self.seated,
            "neighborhood": self.neighborhood,
            "type": self.type,
            "coordinates": self.coordinates,
            "thumbnail_url": self.thumbnail_url,
            "redirect_url": self.redirect_url,
        }
