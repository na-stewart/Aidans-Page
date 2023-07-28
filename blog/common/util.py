from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from aiosmtplib import SMTP

from blog.common.base_model import BaseModel
from blog.common.config import config


async def send_email(receiver, subject, content):
    message = MIMEMultipart()
    message["From"] = "blog@noreply.na-stewart.com"
    message["To"] = receiver
    message["Subject"] = subject
    message.attach(MIMEText(content))
    async with SMTP(hostname="email-smtp.us-east-2.amazonaws.com", port=587) as smtp:
        await smtp.login(config.SMTP_USERNAME, config.SMTP_PASSWORD)
        await smtp.send_message(message)


def model_prefetched_or_none(model):
    return model if issubclass(model, BaseModel) else None


def get_page_from_args(request):
    return (
        1
        if request.args.get("page") in (None, "null")
        else int(request.args.get("page"))
    )
