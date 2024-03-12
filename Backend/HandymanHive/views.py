
from datetime import datetime, timedelta
import statistics
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings
from .models import CustomWorker, Service, Certification, Location, WorkerDetails, OTPModel
import jwt
import json
import jwt
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

def send_otp_email(email, otp, type='Login'):
    subject = 'Your OTP for {type}'
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
            return JsonResponse({'error': 'Email already exists'}, status=405)
        
        if OTPModel.objects.filter(email=email).exists():
            try:
                
                user = OTPModel.objects.get(email=email)
                otp = generate_otp()
                user.otp = otp
                user.otp_valid_till = timezone.now() + timedelta(minutes=5)
                user.save()

                # Send OTP to user
                send_otp_email(email, otp, 'Signup')
                return JsonResponse({'message': 'OTP sent successfully'})            
            except Exception as e:
                print(e)
                return JsonResponse({'error': 'Error sending OTP'}, status=500)

        try:
            user = OTPModel.objects.create(email=email, otp_valid_till=timezone.now() + timedelta(minutes=5),worker_details=json.dumps(data))            
            otp = generate_otp()
            user.otp = otp
            user.otp_valid_till = timezone.now() + timedelta(minutes=5)
            user.save()
            send_otp_email(email, otp)
            return JsonResponse({'message': 'OTP sent successfully'})
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'Error sending OTP'}, status=500)  



    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def verify_otp(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        otp = data.get('otp')

        if CustomWorker.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=500)

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
                
                payload={
                    'email':worker.email,
                    'exp': datetime.utcnow()+timedelta(days=1),
                    'iat': datetime.utcnow()
                }  
                
                response = JsonResponse({'message': 'OTP verified successfully'})
                token=jwt.encode(payload,'Hello world',algorithm='HS256')
            
                response.set_cookie('token', token, expires=payload['exp'], secure=True, httponly=True)
                return response
        
            elif user.otp_valid_till < timezone.now():
                return JsonResponse({'error': 'OTP expired'}, status=300)
            else:                
                return JsonResponse({'error': 'Invalid OTP'}, status=300)
        except Exception as e:           
            return JsonResponse({'error': 'Error Verifying OTP'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

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
    if request.method == 'POST':

        try: 
            data = json.loads(request.body)
            email = data.get('email')
            
            user = CustomWorker.objects.get(email=email)  
            otp = generate_otp()
            user.otp = otp
            user.otp_valid_till = timezone.now() + timedelta(minutes=5)
            user.save()
            
            send_otp_email(email, otp)

            return JsonResponse({'message': 'OTP sent successfully'})
        except CustomWorker.DoesNotExist:
                return JsonResponse({'error': 'User with this email does not exist.'}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'Error sending OTP'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def verify_login_otp(request):    
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        otp = data.get('otp')


        try:
            user = CustomWorker.objects.get(email=email)
            if user.otp == otp and user.otp_valid_till > timezone.now():
                # Get user

                payload={                    
                    'email': user.email,
                    'exp': datetime.utcnow() + timedelta(days=1),
                    'iat': datetime.utcnow()                    
                }

                response= JsonResponse({'message': 'OTP verified successfully',})
                token = jwt.encode(payload, 'helloworld', algorithm='HS256')

                response.set_cookie('token', token, expires=payload['exp'], secure=True, httponly=True)
                return response

            elif user.otp_valid_till < timezone.now():
                return JsonResponse({'error': 'OTP expired'}, status=500)
            else:
                print(user.otp)
                return JsonResponse({'error': 'Invalid OTP'})            
        except CustomWorker.DoesNotExist:
                return JsonResponse({'error': 'User with this email does not exist.'}, status=404)
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'Invalid OTP'})
    else:
        return JsonResponse({'error': 'Invalid request method'})
                



@csrf_exempt
def worker_delete(request):
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

    return JsonResponse({'error': 'Invalid request method'}, status=400)