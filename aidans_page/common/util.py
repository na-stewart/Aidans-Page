from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from aiosmtplib import SMTP

from aidans_page.common.config import config


async def send_email(receiver, subject, content):
    message = MIMEMultipart()
    message["From"] = "Aidans-Page@noreply.na-stewart.com"
    message["To"] = receiver
    message["Subject"] = subject
    message.attach(MIMEText(str(content)))
    async with SMTP(hostname="email-smtp.us-east-2.amazonaws.com", port=587) as smtp:
        await smtp.login(config.SMTP_USERNAME, config.SMTP_PASSWORD)
        await smtp.send_message(message)
