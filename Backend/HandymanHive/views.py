
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings
from .models import CustomWorker, Service, Certification, Location, WorkerDetails, OTPModel
import json
import random
import string
from django.core.mail import send_mail




# Signup view for workers
def index(request):
    return JsonResponse({"msg":"Hello World"})

def generate_otp(length=6):
    characters = string.digits
    otp = ''.join(random.choice(characters) for _ in range(length))
    return otp

def send_otp_email(email, otp):
    subject = 'Your OTP for Login'
    message = f'Your OTP is: {otp}'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)



@csrf_exempt
def worker_signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)        
        email = data.get('email')        


        if CustomWorker.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'})
        
        if OTPModel.objects.filter(email=email).exists():
            try:
                
                user = OTPModel.objects.get(email=email)
                otp = generate_otp()
                user.otp = otp
                user.otp_valid_till = timezone.now() + timedelta(minutes=5)
                user.save()

                # Send OTP to user
                send_otp_email(email, otp)
                return JsonResponse({'message': 'OTP sent successfully'})            
            except Exception as e:
                
                return JsonResponse({'error': 'Error sending OTP'})

        try:
            user = OTPModel.objects.create(email=email, otp_valid_till=timezone.now() + timedelta(minutes=5),worker_details=json.dumps(data))            
            otp = generate_otp()
            user.otp = otp
            user.otp_valid_till = timezone.now() + timedelta(minutes=5)
            user.save()
            send_otp_email(email, otp)
            return JsonResponse({'message': 'OTP sent successfully'})
        except Exception as e:
            
            return JsonResponse({'error': 'Error sending OTP'})  



    return JsonResponse({'error': 'Invalid request method'})


@csrf_exempt
def verify_otp(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        otp = data.get('otp')

        if CustomWorker.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'})

        try:
            user = OTPModel.objects.get(email=email)
            print(user.otp, user.otp_valid_till, timezone.now())
            if user.otp == otp and user.otp_valid_till > timezone.now():
                # Create user
                user_data = json.loads(user.worker_details)
                print(user_data)
                worker = CustomWorker.objects.create_user(
                    phone_number=user_data['phone_number'], 
                    first_name=user_data['first_name'], 
                    last_name=user_data['last_name'], 
                    email=user_data['email'],
                    age=int(user_data['age']),
                    gender=user_data['gender'],
                    address=user_data['address'],
                    city=user_data['city'],
                    state=user_data['state'],
                    zip_code=user_data['zip_code']
                )  
                print(worker)
                
                return JsonResponse({'message': 'OTP verified successfully'})         
            elif user.otp_valid_till < timezone.now():
                return JsonResponse({'error': 'OTP expired'})
            else:
                
                return JsonResponse({'error': 'Invalid OTP'})
        except Exception as e:
           
            return JsonResponse({'error': 'Error Sending OTP'})
    else:
        return JsonResponse({'error': 'Invalid request method'})
    

@csrf_exempt
def delete_entry(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        
        if CustomWorker.objects.filter(email=email).exists():
            user = CustomWorker.objects.get(email=email)
            user.delete()
            
        if OTPModel.objects.filter(email=email).exists():
            user = OTPModel.objects.get(email=email)
            user.delete()

        return JsonResponse({'message': 'Entry deleted successfully'})


        

@csrf_exempt
def worker_login(request):
    return JsonResponse({'msg':'Hello World'})
                



