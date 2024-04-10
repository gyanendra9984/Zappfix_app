import json
from django.test import TestCase
from django.urls import reverse
from HandymanHive.models import CustomWorker, CustomUser
from HandymanHive.routes.profile import upload_profile_pic
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import JsonResponse, HttpRequest
import cloudinary

class TestUploadProfilePic(TestCase):
    def setUp(self):
        # Create CustomWorker and CustomUser instances for testing
        self.worker = CustomWorker.objects.create(
            email='worker@example.com',
            phone_number='1234567890',
            first_name='John',
            last_name='Doe',
            age=30,
            gender='Male',
            address='123 Main St',
            city='New York',
            state='NY',
            zip_code='10001',
        )
        self.user = CustomUser.objects.create(
            email='user@example.com',
            phone_number='9876543210',
            first_name='Jane',
            last_name='Doe',
            age=25,
            gender='Female',
            address='456 Elm St',
            city='Los Angeles',
            state='CA',
            zip_code='90001',
        )

    def test_upload_profile_pic_worker_success(self):
        # Test for successful profile picture upload for worker
        image_file = SimpleUploadedFile("test_image.jpeg", b"file_content", content_type="image/jpeg")
        request = self._create_request("POST", email="worker@example.com", isWorker="True", image=image_file)
        response = upload_profile_pic(request)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, {"message": "Image uploaded successfully"})
        # Assert that the profile picture URL has been updated in the database for the worker
        updated_worker = CustomWorker.objects.get(email='worker@example.com')
        self.assertIsNotNone(updated_worker.profile_pic)

    def test_upload_profile_pic_user_success(self):
        # Test for successful profile picture upload for user
        image_file = SimpleUploadedFile("test_image.jpeg", b"file_content", content_type="image/jpeg")
        request = self._create_request("POST", email="user@example.com", isWorker="False", image=image_file)
        response = upload_profile_pic(request)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, {"message": "Image uploaded successfully"})
        # Assert that the profile picture URL has been updated in the database for the user
        updated_user = CustomUser.objects.get(email='user@example.com')
        self.assertIsNotNone(updated_user.profile_pic)

    def test_upload_profile_pic_missing_user_email(self):
        # Test for missing email key in request
        image_file = SimpleUploadedFile("test_image.jpeg", b"file_content", content_type="image/jpeg")
        request = self._create_request("POST", isWorker="False", image=image_file)
        response = upload_profile_pic(request)
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, {"error": "User not found"})
        
    def test_upload_profile_pic_missing_worker_email(self):
        # Test for missing email key in request
        image_file = SimpleUploadedFile("test_image.jpeg", b"file_content", content_type="image/jpeg")
        request = self._create_request("POST", isWorker="True", image=image_file)
        response = upload_profile_pic(request)
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, {"error": "Invalid request body"})

    def test_upload_profile_pic_missing_image(self):
        # Test for missing image key in request
        request = self._create_request("POST", email="worker@example.com", isWorker="True")
        response = upload_profile_pic(request)
        self.assertEqual(response.status_code, 500)

    def test_upload_profile_pic_worker_not_found(self):
        # Test for worker not found
        image_file = SimpleUploadedFile("test_image.jpeg", b"file_content", content_type="image/jpeg")
        request = self._create_request("POST", email="unknown_worker@example.com", isWorker="True", image=image_file)
        response = upload_profile_pic(request)
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, {"error": "User not found"})

    def test_upload_profile_pic_user_not_found(self):
        # Test for user not found
        image_file = SimpleUploadedFile("test_image.jpeg", b"file_content", content_type="image/jpeg")
        request = self._create_request("POST", email="unknown_user@example.com", isWorker="False", image=image_file)
        response = upload_profile_pic(request)
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, {"error": "User not found"})

    def test_upload_profile_pic_invalid_request_method(self):
        # Test for invalid request method
        response = self.client.get(reverse("upload_profile_pic"))
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, {"error": "Invalid request method"})

    def _create_request(self, method, email=None, isWorker=None, image=None):
        request = HttpRequest()
        request.method = method
        if email is not None:
            request.POST["email"] = email
        if isWorker is not None:
            request.POST["isWorker"] = isWorker
        if image is not None:
            request.FILES["image"] = image
        return request
