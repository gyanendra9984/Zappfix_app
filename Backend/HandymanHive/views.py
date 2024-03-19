from datetime import datetime, timedelta
import os
import statistics
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings
from .models import (
    AbstractUser,
    CustomUser,
    CustomWorker,
    Service,
    Certification,    
    WorkerDetails,
)

import jwt
import json
import random
import string
from django.core.mail import send_mail


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

        if isWorker and CustomWorker.objects.filter(email=email).exists() :
            return JsonResponse({"error": "Email already exists"}, status=405)
        
        if  (not isWorker) and CustomUser.objects.filter(email=email).exists() :
            return JsonResponse({"error": "Email already exists"}, status=405)


        if AbstractUser.objects.filter(email=email).exists():
            try:
                user = AbstractUser.objects.get(email=email)
                otp = generate_otp()
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

        if isWorker=="True" and CustomWorker.objects.filter(email=email).exists() :
            return JsonResponse({"error": "Email already exists"}, status=405)
        
        if isWorker=="False" and CustomUser.objects.filter(email=email).exists() :
            return JsonResponse({"error": "Email already exists"}, status=405)

        try:
            user = AbstractUser.objects.get(email=email)
            if str(user.is_worker) != isWorker:
                return JsonResponse({"message": "User not found"}, status=404)
            
            if user.otp == otp and user.otp_valid_till > timezone.now():                
                user_data = json.loads(user.user_details)
                
                if isWorker=="True":
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
                        email=user_data['email']                                             
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
            print("Vlaue of isWoker=",isWorker)

            if isWorker=="True":
                user= CustomWorker.objects.get(email=email)
            else:
                user = CustomUser.objects.get(email=email)
            print("im Here")
            otp = generate_otp()
            user.otp = otp
            user.otp_valid_till = timezone.now() + timedelta(minutes=5)
            user.save()

            send_otp_email(email, otp)

            return JsonResponse({"message": "OTP sent successfully"})
        except CustomWorker.DoesNotExist or CustomUser.DoesNotExist:
            return JsonResponse(
                {"error": "User with this email does not exist."}, status=404
            )
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

        try:
            if isWorker=="True":
                user= CustomWorker.objects.get(email=email)
            else:
                user = CustomUser.objects.get(email=email)
                
            if user.otp == otp and user.otp_valid_till > timezone.now():                

                payload = {
                    "email": user.email,
                    "exp": datetime.utcnow() + timedelta(days=1),
                    "iat": datetime.utcnow(),
                }

                response = JsonResponse(
                    {
                        "message": "OTP verified successfully",
                    }
                )
                token = jwt.encode(payload, os.getenv("Secret_Key"), algorithm="HS256")

                response.set_cookie(
                    "token", token, expires=payload["exp"], secure=True, httponly=True
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
            token = request.COOKIES["token"]
            
            payload = jwt.decode(token, os.getenv("Secret_Key"), algorithms=["HS256"])

            if email != payload.get("email"):
                return JsonResponse({"error": "Invalid email"}, status=400)

            if isWorker=="True":
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
            return JsonResponse(
                {"error": "Email does not exist."}, status=404
            )
        except Exception as e:            
            return JsonResponse({"error": "Error updating profile"}, status=500)

@csrf_exempt
def edit_worker_profile(request):
    if request.method == "POST":
        data = json.loads(request.body)
        isWorker = data.get('isWorker')
        if(str(isWorker)=="False"):
            return JsonResponse({"error": "Invalid request"}, status=400)
        try:
            email = data.get("email")
            services = data.get("services")
            print(services)
            certifications = data.get("certifications")
            
            
            user = WorkerDetails.objects.get(email=email)
            for item in services:
                if not Service.objects.filter(name=item).exists():
                    service = Service.objects.create(name=item)
                    service.description='a'
                    service.save()
                                    
                try:                    
                    service = Service.objects.get(name=item)                                     
                    user.services_offered.add(service)                    
                    print("Service Added", item)
                except Exception as e:
                    print(e)
                    print(item)
                    pass
                
            for certification in certifications:
                try:
                    certification = Certification.objects.get(name=certification)
                    #Certification Verification to be implemented
                    user.certifications.add(certification[0])
                except:
                    pass
            user.save()
            
            return JsonResponse({"message": "Profile updated successfully"})
            
        except CustomWorker.DoesNotExist:
            return JsonResponse(
                {"error": "Email does not exist."}, status=404
            )



@csrf_exempt
def delete_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        isWorker = data.get('isWorker')
        
        if isWorker=="True" and CustomWorker.objects.filter(email=email).exists():
            user = CustomWorker.objects.get(email=email)
            user.delete()
            
        if isWorker=="False" and CustomUser.objects.filter(email=email).exists():
            user = CustomUser.objects.get(email=email)
            user.delete()
            
        if AbstractUser.objects.filter(email=email).exists():
            user = AbstractUser.objects.get(email=email)
            user.delete()

        return JsonResponse({'message': 'User deleted successfully'})

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def get_user_data(request):
    if request.method == 'GET':        
        try:
            data = json.loads(request.body)
            email= data.get('email')
            isWorker = data.get('isWorker')
            token = request.COOKIES['token']
            payload = jwt.decode(token, os.getenv("Secret_Key"), algorithms=['HS256'])
            
            if email != payload.get("email"):
                return JsonResponse({"error": "Invalid email"}, status=400)
            
            if isWorker=="True":
                user = CustomWorker.objects.get(email=email)
            else:
                user = CustomUser.objects.get(email=email)
            
            user_details = {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'phone_number': user.phone_number,
                'age': user.age,
                'gender': user.gender,
                'address': user.address,
                'city': user.city,
                'state': user.state,
                'zip_code': user.zip_code,
            }
            return JsonResponse({'worker_details': user_details})
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token expired'}, status=300)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=300)
        except CustomWorker.DoesNotExist or CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'Error fetching user data'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)





