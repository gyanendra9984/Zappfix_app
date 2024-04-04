from datetime import datetime, timedelta
import os
import base64
from django.db.models import F, Q
from django.db.models import ExpressionWrapper, FloatField
from django.db.models.functions import ACos, Cos, Radians, Sin, Sqrt
import spacy
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.conf import settings
from django.db.models import F
from .models import (
    AbstractUser,
    CustomUser,
    CustomWorker,
    Service,
    Certification,
    WorkerDetails,
    Request,
)


# from .firebase import *

import jwt
import json
import random
import string
import cloudinary.uploader
from django.core.mail import send_mail

adminlist=["2021csb1062@iitrpr.ac.in","2021csb1124@iitrpr.ac.in"]
# Signup view for workers
def index(request):
    return JsonResponse({"msg": "Hello World"})


def generate_otp(length=6):
    characters = string.digits
    otp = "".join(random.choice(characters) for _ in range(length))
    return otp


def send_otp_email(email, otp, type="Login"):
    subject = "Your OTP for {type}"
    message = f"Your OTP is: {otp}"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)


########################## WORKER CRUD Routes #########################


@csrf_exempt
def user_signup(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        isWorker = data.get("isWorker")
        print("Value of isWorker in user_signup is =", isWorker)

        if isWorker == "True" and CustomWorker.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=405)

        if isWorker == "False" and CustomUser.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=405)
        print("I have passed if ")

        if AbstractUser.objects.filter(email=email).exists():
            try:
                user = AbstractUser.objects.get(email=email)
                otp = generate_otp()
                print("Generated Otp=",otp)
                user.otp = otp
                user.otp_valid_till = timezone.now() + timedelta(minutes=15)
                user.user_details = json.dumps(data)
                user.is_worker = isWorker
                user.save()

                # Send OTP to user
                send_otp_email(email, otp, "Signup")
                return JsonResponse({"message": "OTP sent successfully"})
            except Exception as e:
                print(e)
                return JsonResponse({"error": "Error sending OTP"}, status=500)

        try:
            user = AbstractUser.objects.create(
                email=email,
                otp_valid_till=timezone.now() + timedelta(minutes=15),
                user_details=json.dumps(data),
                is_worker=isWorker,
            )
            otp = generate_otp()
            user.otp = otp
            user.save()
            send_otp_email(email, otp)
            return JsonResponse({"message": "OTP sent successfully"})
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Error sending OTP"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def verify_otp(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        otp = data.get("otp")
        isWorker = data.get("isWorker")

        if isWorker == "True" and CustomWorker.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=405)

        if isWorker == "False" and CustomUser.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=405)

        try:
            user = AbstractUser.objects.get(email=email)
            if str(user.is_worker) != isWorker:
                return JsonResponse({"message": "User not found"}, status=404)

            if user.otp == otp and user.otp_valid_till > timezone.now():
                user_data = json.loads(user.user_details)

                if isWorker == "True":
                    user = CustomWorker.objects.create(
                        phone_number=user_data["phone_number"],
                        first_name=user_data["first_name"],
                        last_name=user_data["last_name"],
                        email=user_data["email"],
                        age=int(user_data["age"]),
                        gender=user_data["gender"],
                        address=user_data["address"],
                        city=user_data["city"],
                        state=user_data["state"],
                        zip_code=user_data["zip_code"],
                    )

                    worker_details = WorkerDetails.objects.create(
                        email=user_data["email"]
                    )
                    worker_details.save()
                    user.save()
                else:
                    user = CustomUser.objects.create(
                        phone_number=user_data["phone_number"],
                        first_name=user_data["first_name"],
                        last_name=user_data["last_name"],
                        email=user_data["email"],
                        age=int(user_data["age"]),
                        gender=user_data["gender"],
                        address=user_data["address"],
                        city=user_data["city"],
                        state=user_data["state"],
                        zip_code=user_data["zip_code"],
                    )
                    user.save()

                payload = {
                    "email": user.email,
                    "exp": datetime.utcnow() + timedelta(days=1),
                    "iat": datetime.utcnow(),
                }

                isAdmin=False
                for em in adminlist:
                    if em==email:
                        isAdmin=True                
                if isAdmin:                     
                    response = JsonResponse({"message": "OTP verified successfully","isAdmin":"True"})        
                else :              
                    response = JsonResponse({"message": "OTP verified successfully"})
                token = jwt.encode(payload, os.getenv("Secret_Key"), algorithm="HS256")

                response.set_cookie(
                    "token", token, expires=payload["exp"], secure=True, httponly=True
                )
                return response

            elif user.otp_valid_till < timezone.now():
                return JsonResponse({"error": "OTP expired"}, status=300)
            else:
                return JsonResponse({"error": "Invalid OTP"}, status=300)
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Error Verifying OTP"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def user_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            isWorker = data.get("isWorker")
            
            print("Value of isWorker in userLogin=", isWorker)

            if isWorker == "True":
                user_model = CustomWorker
                # user = CustomWorker.objects.get(email=email)
            else:
                user_model = CustomUser
                # user = CustomUser.objects.get(email=email)

            try:
                user = user_model.objects.get(email=email)
            except user_model.DoesNotExist:
                return JsonResponse(
                    {"error": "User with this email does not exist."}, status=404
                )
            # print("im Here")
            otp = generate_otp()
            # print("Generatd Otp=",otp)
            user.otp = otp
            user.otp_valid_till = timezone.now() + timedelta(minutes=50)
            user.save()

            send_otp_email(email, otp)

            return JsonResponse({"message": "OTP sent successfully"})
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Error sending OTP"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def verify_login_otp(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        otp = data.get("otp")
        isWorker = data.get("isWorker")
        print("isWorker=", isWorker)

        try:
            if isWorker == "True":
                user = CustomWorker.objects.get(email=email)
            else:
                user = CustomUser.objects.get(email=email)

            print("userotp=", user.otp)
            print("otp=", otp)

            if str(user.otp) == str(otp) and user.otp_valid_till > timezone.now():

                payload = {
                    "email": user.email,
                    "exp": datetime.utcnow() + timedelta(days=1),
                    "iat": datetime.utcnow(),
                }
                print("otp=",otp)
                token = jwt.encode(payload, os.getenv("Secret_Key"), algorithm="HS256")
                print("token during login=", token)

                # response.set_cookie(
                #     "token", token, expires=None, secure=True, samesite='None'
                # )
                response = JsonResponse(
                    {
                        "message": "OTP verified successfully",
                        "token": token,
                    }
                )

                return response

            elif user.otp_valid_till < timezone.now():
                return JsonResponse({"error": "OTP expired"}, status=500)
            else:
                return JsonResponse({"error": "Invalid OTP"})
        except CustomWorker.DoesNotExist or CustomUser.DoesNotExist:
            return JsonResponse(
                {"error": "User with this email does not exist."}, status=404
            )
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Invalid OTP"})
    else:
        return JsonResponse({"error": "Invalid request method"})


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
def user_last_five_queries(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            user = CustomUser.objects.get(email=email)
            last_five_queries = user.get_last_five_queries()
            return JsonResponse({"last_five_queries": last_five_queries})
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "Email does not exist"}, status=404)
    else:
        return JsonResponse({"error": "Invalid Request Method"}, status=400)


@csrf_exempt
def create_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            user_email = data['user_email']
            worker_email = data['worker_email']
            service = data['service']            

        except json.JSONDecodeError:
            return JsonResponse(
                {"status": "error", "message": "Invalid JSON data"}, status=400
            )
        except KeyError:
            return JsonResponse(
                {"status": "error", "message": "Missing required fields"}, status=400
            )

        try:
            user = CustomUser.objects.get(email=user_email)
            worker = CustomWorker.objects.get(email=worker_email)            
        except CustomUser.DoesNotExist:
            return JsonResponse(
                {"status": "error", "message": "User does not exist"}, status=404
            )
        except CustomWorker.DoesNotExist:

            return JsonResponse({'status': 'error', 'message': 'Worker does not exist'}, status=404)
        

        Request.objects.create(user=user, worker=worker, service=service)
        
        return JsonResponse({'status': 'success', 'message': 'Request created successfully'})

    else:
        return JsonResponse(
            {"status": "error", "message": "Only POST requests are allowed"}, status=405
        )


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
def get_worker_profile(request):
    if request.method=='POST':
        try:
            data = json.loads(request.body)
            email=data.get('email')
            worker_email=data.get('worker_email')
            worker = CustomWorker.objects.get(email=worker_email)
            worker_details = WorkerDetails.objects.get(email=worker_email)            
            services_offered = worker_details.services_offered.all()
            services = [service.name for service in services_offered]
            cert = Certification.objects.filter(worker_email=worker_email)
            certifications = [(certification.certificate_name, certification.issuing_authority) for certification in cert]
            
            return JsonResponse({
                "first_name": worker.first_name, 
                "last_name": worker.last_name, 
                "email": worker.email, 
                "phone_number": worker.phone_number,                 
                "age": worker.age,
                "years_of_exp": worker_details.years_of_experience,
                "services":services,
                "certification":certifications,
                })
            
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Error fetching worker profile"}, status=500)
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


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
def get_user_requests(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            print("mail=",email)
            worker= CustomWorker.objects.get(email=email)
            print("Heree")
            requests = Request.objects.filter(worker=worker)
            user_requests = []
            for request in requests:
                user = request.user
                user_requests.append({
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'service': request.service,
                    'created_on': request.created_on,
                    'status': request.status                                        
                })
            return JsonResponse({'requests': user_requests})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': 'Error fetching requests'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


###################### RECOMMENDATION SYSTEM #######################


@csrf_exempt
def get_workers_on_price(request):
    if request.method == "GET":
        try:
            data = json.loads(request.body)
            service_name = data.get("service_name")

            service = Service.objects.get(name=service_name)

            top_five_workers_details = (
                WorkerDetails.objects.filter(isAvailable=True)
                .filter(services_offered__in=[service])
                .annotate(average_price=(F("min_price") + F("max_price")) / 2)
                .order_by("average_price")[:5]
            )

            top_five_workers = []
            for worker_detail in top_five_workers_details:
                worker = CustomWorker.objects.get(email=worker_detail.email)
                worker_data = {
                    "email": worker.email,
                    "first_name": worker.first_name,
                    "last_name": worker.last_name,
                }
                top_five_workers.append(worker_data)

            return JsonResponse({"top_five_custom_workers": top_five_workers})
        except Service.DoesNotExist:
            return JsonResponse({"error": "Service not found"}, status=404)
        except WorkerDetails.DoesNotExist:
            return JsonResponse({"error": "WorkerDetails not found"}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Error fetching worker data"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def get_nearest_workers(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            service_name = data.get("service")
            user_coords = data.get("coords")
            print("coords=", user_coords)
            print("Given service_name=", service_name)

            user_latitude_rad = Radians(user_coords[0])
            user_longitude_rad = Radians(user_coords[1])
            all_services = Service.objects.all()

            # Iterate over each service and print its details
            # print("lentgh=",len(all_services))
            # for service in all_services:
            #     print(f"Service Name: {service.name}")
            # # print("Here are the services=",Service.objects.all())
            service = Service.objects.get(name=service_name)

            # print("Here")
            workers = (
                WorkerDetails.objects.filter(services_offered__in=[service])
                .annotate(
                    latitude_radians=ExpressionWrapper(
                        Radians(F("liveLatitude")), output_field=FloatField()
                    ),
                    longitude_radians=ExpressionWrapper(
                        Radians(F("liveLongitude")), output_field=FloatField()
                    ),
                    dlat=ExpressionWrapper(
                        Sin((F("latitude_radians") - user_latitude_rad) / 2) ** 2,
                        output_field=FloatField(),
                    ),
                    dlon=ExpressionWrapper(
                        Sin((F("longitude_radians") - user_longitude_rad) / 2) ** 2,
                        output_field=FloatField(),
                    ),
                    a=ExpressionWrapper(
                        (
                            F("dlat")
                            + Cos(user_latitude_rad)
                            * Cos(F("latitude_radians"))
                            * F("dlon")
                        ),
                        output_field=FloatField(),
                    ),
                    c=ExpressionWrapper(
                        2 * ACos(Sqrt(F("a"))), output_field=FloatField()
                    ),
                    distance=ExpressionWrapper(
                        6371 * F("c"), output_field=FloatField()
                    ),
                )
                .order_by("distance")[:5]
            )
            print(1)

            worker_details = []

            for worker in workers:
                details = CustomWorker.objects.get(email=worker.email)
                worker_details.append(
                    {
                        "first_name": details.first_name,
                        "last_name": details.last_name,
                        "email": details.email,
                        "liveLatitude": worker.liveLatitude,
                        "liveLongitude": worker.liveLongitude,
                        "distance": worker.distance,
                    }
                )
            print("Worker Details", worker_details)

            return JsonResponse({"workers": worker_details})

        except Exception as e:
            print(e)
            return JsonResponse({"error": "Error fetching workers"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


############################SEARCH FUNCTIONALITY########################


@csrf_exempt
def get_closest_services(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get("query")
            email = data.get("email")
            user = CustomUser.objects.get(email=email)
            # Add the query using the add_query method
            user.add_query(query)
            user.save()

            nlp = spacy.load("en_core_web_md")

            query_tokens = [
                token.text
                for token in nlp(query)
                if not token.is_stop and not token.is_punct
            ]
            # print(query_tokens)
            print([token.vector for token in nlp(" ".join(query_tokens))])
            query_embedding = np.mean(
                [token.vector for token in nlp(" ".join(query_tokens))], axis=0
            )
            # print(query_embedding)

            services = Service.objects.all()

            similarities = []
            for service in services:
                # print(service.name)
                service_tokens = [
                    token.text
                    for token in nlp(service.name)
                    if not token.is_stop and not token.is_punct
                ]
                service_embedding = np.mean(
                    [token.vector for token in nlp(" ".join(service_tokens))], axis=0
                )
                similarity = cosine_similarity([query_embedding], [service_embedding])[
                    0
                ][0]
                similarities.append(similarity)

            service_pairs = zip(similarities, services)

            desired_services = sorted(service_pairs, key=lambda x: x[0], reverse=True)[
                :10
            ]

            closest_services = []
            for similarity, service in desired_services:
                closest_services.append({"name": service.name})

            closest_workers = []
            workers = CustomWorker.objects.filter(
                Q(first_name__icontains=query) | Q(last_name__icontains=query)
            )[:5]

            for worker in workers:
                closest_workers.append(
                    {
                        "first_name": worker.first_name,
                        "last_name": worker.last_name,
                        "email": worker.email,
                    }
                )

            return JsonResponse(
                {"services": closest_services, "workers": closest_workers}
            )

        except Exception as e:
            print(e)
            return JsonResponse({"error": "Error fetching service"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
##################################HELPER FUNCTIONS####################################
@csrf_exempt
def insert_worker(request):
    try:
        SERVICES = [
            "Plumbing",
            "Electrical",
            "Carpentry",
            "Painting",
            "Landscaping",
            "Gardening",
            "Roofing",
            "Flooring",
            "HVAC (Heating, Ventilation, and Air Conditioning)",
            "Appliance Repair",
            "Window Cleaning",
            "Pressure Washing",
            "Pest Control",
            "Home Security Installation",
            "Drywall Repair",
            "Furniture Assembly",
            "Interior Design",
            "Home Cleaning",
            "Carpet Cleaning",
            "Masonry",
            "Fence Installation",
            "Deck Construction",
            "Gutter Cleaning",
            "Tree Trimming",
            "Pool Maintenance",
            "Locksmith",
            "Garage Door Repair",
            "Water Damage Restoration",
            "Kitchen Remodeling",
            "Bathroom Remodeling",
            "Home Theater Installation",
            "Home Automation",
            "Solar Panel Installation",
            "Septic Tank Services",
            "Exterior Painting",
            "Siding Installation",
            "Wallpaper Removal",
            "Home Insulation",
            "Chimney Cleaning",
            "Foundation Repair",
            "Basement Waterproofing",
            "Drain Cleaning",
            "Welding Services",
            "Elevator Installation",
            "Bathtub Refinishing",
            "Countertop Installation",
            "Ceiling Fan Installation",
            "Fireplace Installation",
            "Shower Installation",
            "Security Camera Installation",
            "Ceiling Repair",
            "Home Renovation",
            "Shed Construction",
        ]
        FIRST = [
            "James",
            "John",
            "Robert",
            "Michael",
            "William",
            "David",
            "Richard",
            "Joseph",
            "Charles",
            "Thomas",
            "Mary",
            "Jennifer",
            "Linda",
            "Patricia",
            "Elizabeth",
            "Barbara",
            "Susan",
            "Jessica",
            "Sarah",
            "Karen",
            "Daniel",
            "Matthew",
            "Anthony",
        ]

        LAST = [
            "Smith",
            "Johnson",
            "Williams",
            "Jones",
            "Brown",
            "Davis",
            "Miller",
            "Wilson",
            "Moore",
            "Taylor",
            "Anderson",
            "Thomas",
            "Jackson",
            "White",
            "Harris",
            "Martin",
            "Thompson",
            "Garcia",
            "Martinez",
            "Robinson",
            "Clark",
            "Rodriguez",
            "Lewis",
            "Lee",
        ]
        for i in FIRST:
            for j in LAST:

                try:
                    phone_number = "".join(random.choices(string.digits, k=10))
                    first_name = i
                    last_name = j
                    email = f"{first_name.lower()}.{last_name.lower()}@gmail.com"
                    age = "25"
                    gender = "Male"
                    address = "address"
                    city = "city"
                    state = "city"
                    zip_code = "zip_code"
                    num_services = random.randint(1, len(SERVICES))
                    services = random.sample(SERVICES, num_services)
                    latitude = round(random.uniform(30.8, 31.2), 4)
                    longitude = round(random.uniform(76.4, 76.8), 4)


                    if CustomWorker.objects.filter(email=email).exists():
                        worker = CustomWorker.objects.get(email=email)  
                    else:
                        worker = CustomWorker.objects.get_or_create(
                            phone_number=phone_number,
                            first_name=first_name,
                            last_name=last_name,
                            email=email,
                            age=age,
                            gender=gender,
                            address=address,
                            city=city,
                            state=state,
                            zip_code=zip_code,
                        )
        
                    try: 
                        worker_details = WorkerDetails.objects.create(
                            email=email,
                            liveLatitude=latitude,
                            liveLongitude=longitude                                
                        )
                    except:
                        worker_details=WorkerDetails.objects.get(email=email)
                        
        
                    for serv in SERVICES:
                        print(serv)
                        if Service.objects.filter(name=serv).exists():
                            print(1)
                            service = Service.objects.get(name=serv)
                        else:
                            print(2)
                            service = Service.objects.create(name=serv)

                                           
                            
                        
                        worker_details.services_offered.add(service)
                

                    worker_details.save()
                    worker.save()
                except Exception as e:
                    print(e)
                    pass
        return JsonResponse({"message": "Worker added successfully"})

    except Exception as e:
        print(e)
        return JsonResponse({"error": "Error adding worker"}, status=500)




#--------NOTIFICATION HELPER--------
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

