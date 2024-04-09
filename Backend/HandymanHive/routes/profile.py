import base64
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import (
    AbstractUser,
    CustomUser,
    CustomWorker,
    Service,
    Certification,
    WorkerDetails,
)
import jwt
import json
import cloudinary.uploader


@csrf_exempt
def get_user_data(request):

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            isWorker = data.get("isWorker")

            if isWorker == "True":

                user = CustomWorker.objects.get(email=email)
            else:
                user = CustomUser.objects.get(email=email)

            user_details = {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone_number": user.phone_number,
                "age": user.age,
                "gender": user.gender,
                "address": user.address,
                "city": user.city,
                "state": user.state,
                "zip_code": user.zip_code,
                "profile_pic": user.profile_pic,
            }
            return JsonResponse({"worker_details": user_details})
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expired"}, status=300)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=300)
        except CustomWorker.DoesNotExist or CustomUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Error fetching user data"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def edit_personal_profile(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            email = data.get("email")
            isWorker = data.get("isWorker")

            if isWorker == "True":
                user = CustomWorker.objects.get(email=email)
            else:
                user = CustomUser.objects.get(email=email)

            user.first_name = data.get("first_name")
            user.last_name = data.get("last_name")
            user.age = data.get("age")
            user.gender = data.get("gender")
            user.address = data.get("address")
            user.city = data.get("city")
            user.state = data.get("state")
            user.zip_code = data.get("zip_code")
            user.phone_number = data.get("phone_number")
            user.save()
            return JsonResponse({"message": "Profile updated successfully"})
        except CustomWorker.DoesNotExist or CustomUser.DoesNotExist:
            return JsonResponse({"error": "Email does not exist."}, status=404)
        except Exception as e:
            return JsonResponse({"error": "Error updating profile"}, status=500)

@csrf_exempt
def upload_profile_pic(request):
    if request.method == "POST":
        try:
            image_file = request.FILES.get("image")
            email = request.POST.get("email")
            isWorker = request.POST.get("isWorker")

            if isWorker == "True":
                user = CustomWorker.objects.get(email=email)
            else:
                user = CustomUser.objects.get(email=email)

            upload_result = cloudinary.uploader.upload(image_file)

            image_url = upload_result.get("secure_url")

            user.profile_pic = image_url
            user.save()
            return JsonResponse({"message": "Image uploaded successfully"})
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse(
                {"error": "Error uploading image: {}".format(str(e))}, status=500
            )
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def update_worker_location(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            email = data.get("email")
            live_latitude = data.get("liveLatitude")
            live_longitude = data.get("liveLongitude")

            worker = WorkerDetails.objects.get(email=email)

            worker.liveLatitude = live_latitude
            worker.liveLongitude = live_longitude
            worker.save()

            return JsonResponse({"message": "Worker location updated successfully"})
        except WorkerDetails.DoesNotExist:
            return JsonResponse({"error": "Worker not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Error updating worker location"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def delete_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        isWorker = data.get("isWorker")

        if isWorker == "True" and CustomWorker.objects.filter(email=email).exists():
            user = CustomWorker.objects.get(email=email)
            user.delete()

        if isWorker == "False" and CustomUser.objects.filter(email=email).exists():
            user = CustomUser.objects.get(email=email)
            user.delete()

        if AbstractUser.objects.filter(email=email).exists():
            user = AbstractUser.objects.get(email=email)
            user.delete()

        return JsonResponse({"message": "User deleted successfully"})

    return JsonResponse({"error": "Invalid request method"}, status=400)


#-----------------WORKER PROFESSIONAL PROFILE ------------------------

######################## SERVICES #############################

@csrf_exempt
def update_services(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            services = data.get("services")
            print("services=",services)
            print("email=",email)
            # print(1)
            worker = WorkerDetails.objects.get(email=email)
            worker.services_offered.clear()
            # print(2)
            for service in services:
                try:
                    obj, is_created = Service.objects.get_or_create(name=service)
                    worker.services_offered.add(obj)                  
                except Exception as e:
                    print(e)
                    return JsonResponse({"error": "Error updating services"}, status=500)
                    
                    

            return JsonResponse({"message": "Services updated successfully"})

        except Exception as e:
            return JsonResponse({"error": "Error updating services"}, status=500)

    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def get_services(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            worker = WorkerDetails.objects.get(email=email)

            services = worker.services_offered.all()
            

            worker_services = []

            for service in services:
                worker_services.append({"name": service.name})

        except Exception as e:
            return JsonResponse({"error": "Error fetching services"}, status=500)

    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


######################## WORKER CERTIFICATIONS #########################

@csrf_exempt
def upload_certificate(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            email = data.get('email')
            certificate_name = data.get('certificate_name')
            # issuing_authority = data.get('issuing_authority')
            certificate_data = data.get('certificate')
            # print(certificate_data)
            pdf_data=base64.b64decode(certificate_data)
            print(1)
            certificate = Certification.objects.create(
                certificate_name=certificate_name,
                worker_email=email,
                # issuing_authority=issuing_authority,
                certificate_data=pdf_data                
            ) 
            # print(certificate_data)
            # certificate.save()
            return JsonResponse({"message": "Certificate uploaded successfully"})       
            
            

        except Exception as e:
            return JsonResponse({"error": "Error uploading certificate"}, status=500)

    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def get_certificates(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")

            certificates = Certification.objects.filter(worker_email=email)

            certificate_data = []
            for certificate in certificates:
                certificate_data.append(
                    {
                        "certificate_name": certificate.certificate_name,
                        "issuing_authority": certificate.issuing_authority,
                        "certificate_data": certificate.certificate_data,
                        "added_on": certificate.created_on,
                        "status": certificate.status,
                    }
                )

            return JsonResponse({"certificates": certificate_data})
        except Exception as e:
            return JsonResponse({"error": "Error fetching certificates"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def approve_certificate(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            worker_email = data.get("worker_email")
            certificate_name = data.get("certificate_name")

            certificate = Certification.objects.get(
                worker_email=worker_email, certificate_name=certificate_name
            )

            certificate.status = "Approved"
            certificate.save()

            return JsonResponse({"message": "Certificate approved successfully"})
        except Certification.DoesNotExist:
            return JsonResponse({"error": "Certificate not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": "Error approving certificate"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
