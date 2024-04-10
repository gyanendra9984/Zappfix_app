import json
from django.http import JsonResponse
import requests
from .notifications import templates




def send_notfication(template, user):
    resp=requests.post("https://exp.host/--/api/v2/push/send", 
        headers={
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json'
        },
        data=json.dumps({
            'to': user.notification_token,
            'sound': 'default',
            'title': templates[template]['title'],
            'body': templates[template]['body'],
        })
        )
    print(resp)
    return JsonResponse({"message":"Notification sent successfully"})