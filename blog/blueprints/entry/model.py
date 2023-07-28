from tortoise import fields

from blog.common.base_model import BaseModel


class Entry(BaseModel):
    title: str = fields.CharField(unique=True, max_length=255)
    summary: str = fields.CharField(max_length=255)
    content: str = fields.TextField()
    published: bool = fields.BooleanField(default=False)
    thumbnail_url: str = fields.CharField(max_length=255)

    @property
    def json(self) -> dict:
        return {
            "id": self.id,
            "date_created": str(self.date_created),
            "date_updated": str(self.date_updated),
            "title": self.title,
            "summary": self.summary,
            "content": self.content if hasattr(self, "content") else None,
            "thumbnail_url": self.thumbnail_url,
            "published": self.published,
        }
