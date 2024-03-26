import pytest
import json
from django.test import Client, TestCase
from django.urls import reverse
from HandymanHive.models import AbstractUser, CustomWorker
from unittest.mock import patch

# @patch('HandymanHive.views.send_otp_email')
# @patch('HandymanHive.views.generate_otp')
@pytest.mark.django_db
class TestLogin(TestCase):
    # def test_valid_login(self, mock_generate_otp, mock_send_otp_email):
    #     client = Client()
    #     valid_data = {
    #         "email": "test@example.com",
    #         "isWorker": False,
    #     }
    #     mock_generate_otp.return_value = 123456
    #     response = client.post(reverse('user_login'), json.dumps(valid_data), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn("OTP sent successfully", response.json().get("message", ""))
    #     self.assertTrue(mock_generate_otp.called)
    #     mock_send_otp_email.assert_called_once_with(valid_data["email"], 123456)

    def test_nonexistent_user(self):
        client = Client()
        nonexistent_data = {
            "email": "none@emaple.com",
            "isWorker": False,
        }
        response = client.post(reverse('user_login'), json.dumps(nonexistent_data), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertIn("User with this email does not exist.", response.json().get("error", ""))

    def test_invalid_request_method(self):
        client = Client()
        response = client.get(reverse('user_login'))
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid request method", response.json().get("error", ""))

    # @patch('HandymanHive.views.timezones.now')
    # def test_expired_otp(self, mock_now):
    #     mock_now.return_value = datetime.now() + timedelta(minutes=10)
    #     client = Client()
        
    def test_invalid_json(self):
        client = Client()
        invalid_data = "This is not JSON"

        response = client.post(reverse('user_login'), invalid_data, content_type='application/json')
        self.assertEqual(response.status_code, 500)

    def test_missing_isworker(self):
        client = Client()
        invalid_data = {
            "email": "test@example.com"
        }
        response = client.post(reverse('user_login'), json.dumps(invalid_data), content_type='application/json')
        self.assertGreaterEqual(response.status_code, 400)


        
