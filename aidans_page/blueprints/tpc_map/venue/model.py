from tortoise import fields

from aidans_page.common.base_model import BaseModel


class Venue(BaseModel):
    name: str = fields.CharField(unique=True, max_length=255)
    summary: str = fields.CharField(max_length=255)
    reception: int = fields.IntField()
    seated: int = fields.IntField()
    capacity: int = fields.CharField(max_length=255)
    neighborhood: str = fields.CharField(max_length=255)
    type: str = fields.CharField(max_length=255)
    coordinates: str = fields.CharField(max_length=255)
    thumbnail_url: str = fields.CharField(max_length=255)
    redirect_url: str = fields.CharField(max_length=255)
    published: bool = fields.BooleanField(default=False)

    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "date_created": str(self.date_created),
            "date_updated": str(self.date_updated),
            "name": self.name,
            "summary": self.summary,
            "reception": self.reception,
            "capacity": self.capacity,
            "seated": self.seated,
            "neighborhood": self.neighborhood,
            "type": self.type,
            "coordinates": self.coordinates,
            "thumbnail_url": self.thumbnail_url,
            "redirect_url": self.redirect_url,
            "published": self.published,
        }
