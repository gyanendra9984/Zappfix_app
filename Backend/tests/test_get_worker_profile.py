import json
from django.test import TestCase
from django.urls import reverse
from HandymanHive.models import CustomWorker, WorkerDetails, Certification
from HandymanHive.routes.worker_history import get_worker_profile

class TestGetWorkerProfile(TestCase):
    def setUp(self):
        # Create sample data for testing
        self.worker_data = {
            "email": "worker@example.com",
            "phone_number": "1234567890",
            "first_name": "John",
            "last_name": "Doe",
            "age": 30,
            "gender": "Male",
            "address": "123 Main St",
            "city": "New York",
            "state": "NY",
            "zip_code": "10001"
        }
        self.worker_data2 = {
            "email": "worker2@example.com",
            "phone_number": "2345678901",
            "first_name": "John",
            "last_name": "Doe",
            "age": 30,
            "gender": "Male",
            "address": "123 Main St",
            "city": "New York",
            "state": "NY",
            "zip_code": "10001"
        }
        
        self.worker = CustomWorker.objects.create(**self.worker_data)
        self.worker_second = CustomWorker.objects.create(**self.worker_data2)
        
        self.worker_details = WorkerDetails.objects.create(
            email="worker@example.com",
            years_of_experience=5,
            min_price=10.00,
            max_price=50.00
        )

        self.certification = Certification.objects.create(
            certificate_name="Cert Name",
            worker_email="worker@example.com",
            issuing_authority="Authority"
        )

    def test_get_worker_profile_success(self):
        # Test for successful profile retrieval
        response = self.client.post(reverse("get_worker_profile"), json.dumps({"email": "user@example.com", "worker_email": "worker@example.com"}), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        # Add more assertions to check the response content

    def test_get_worker_profile_invalid_email(self):
        # Test for invalid email
        response = self.client.post(reverse("get_worker_profile"), json.dumps({"email": "user@example.com", "worker_email": "invalidexample.com"}), content_type="application/json")
        print("Response", response)
        self.assertEqual(response.status_code, 500)
        # Add more assertions to check the error response

    def test_get_worker_profile_worker_not_found(self):
        # Test for worker not found
        response = self.client.post(reverse("get_worker_profile"), json.dumps({"email": "user@example.com", "worker_email": "unknown_worker@example.com"}), content_type="application/json")
        self.assertEqual(response.status_code, 500)
        # Add more assertions to check the error response
        
    def test_get_worker_profile_missing_worker_email(self):
        # Test for missing worker_email key
        response = self.client.post(reverse("get_worker_profile"), json.dumps({"email": "user@example.com"}), content_type="application/json")
        self.assertEqual(response.status_code, 500)
        # Add more assertions to check the error response

    def test_get_worker_profile_missing_user_email(self):
        # Test for missing email key
        response = self.client.post(reverse("get_worker_profile"), json.dumps({"worker_email": "worker@example.com"}), content_type="application/json")
        self.assertEqual(response.status_code, 400)
        # Add more assertions to check the error response

    def test_get_worker_profile_non_existing_worker_email(self):
        # Test for non-existing worker_email
        response = self.client.post(reverse("get_worker_profile"), json.dumps({"email": "user@example.com", "worker_email": "unknown_worker@example.com"}), content_type="application/json")
        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.json())

    def test_get_worker_profile_no_details_found(self):
        # Test for valid data but no details found
        response = self.client.post(reverse("get_worker_profile"), json.dumps({"email": "user@example.com", "worker_email": "worker2@example.com"}), content_type="application/json")
        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.json())

    def test_get_worker_profile_no_certifications_found(self):
        # Test for valid data but no certifications found
        response = self.client.post(reverse("get_worker_profile"), json.dumps({"email": "user@example.com", "worker_email": "worker2@example.com"}), content_type="application/json")
        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.json())


    def test_get_worker_profile_invalid_user_email_format(self):
        # Test for valid data and invalid email format
        data = {
            "email": "invalidexample.com",  # Invalid email format
            "worker_email": "worker@example.com",
        }
        response = self.client.post(reverse("get_worker_profile"), json.dumps(data), content_type="application/json")
        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.json())
        
    def test_get_worker_profile_invalid_worker_email_format(self):
        # Test for valid data and invalid email format
        data = {
            "email": "user@example.com",  # Invalid email format
            "worker_email": "workerexample.com",
        }
        response = self.client.post(reverse("get_worker_profile"), json.dumps(data), content_type="application/json")
        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.json())

    def test_get_worker_profile_invalid_request_method(self):
        # Test for valid data and invalid request method
        response = self.client.get(reverse("get_worker_profile"))
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())


        
    

