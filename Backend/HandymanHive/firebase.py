import firebase_admin
from firebase_admin import credentials, messaging
import os
import json
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
json_file_path = os.path.join(BASE_DIR, 'handymanhive.json')
cred = credentials.Certificate(json_file_path)
firebase_admin.initialize_app(cred)


def send_notif(token, title, body):
    message= messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        token=token
    )
    messaging.send(message)

