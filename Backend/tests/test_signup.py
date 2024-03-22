import pytest
import json
from django.test import Client
from django.urls import reverse
from HandymanHive.models import AbstractUser, CustomWorker
from django.contrib.auth.models import User
from django.test import TestCase

@pytest.mark.django_db
def test_signup():
    client = Client()
    valid_data={
        "email": "test@example.com",
        "isWorker": False,
    }
    response = client.post(reverse('user_signup'), json.dumps(valid_data), content_type='application/json')
    assert response.status_code == 200
    assert "OTP sent successfully" in response.json().get("message", "")

    duplicate_data={
        "email": "test@example.com",
        "isWorker": False,
    }
    response = client.post(reverse('user_signup'), json.dumps(duplicate_data), content_type='application/json')
    assert response.status_code == 405
    assert "User already exists" in response.json().get("message", "")

    invalid_data={
        "email": "test",
        "isWorker": False,
    }
    response = client.post(reverse('user_signup'), json.dumps(invalid_data), content_type='application/json')
    assert response.status_code == 400
    assert "Invalid email" in response.json().get("message", "")

    invalid_data={
        "email": "",
        "isWorker": False,
    }
    response = client.post(reverse('user_signup'), json.dumps(invalid_data), content_type='application/json')
    assert response.status_code == 400
    assert "Invalid email" in response.json().get("message", "")

