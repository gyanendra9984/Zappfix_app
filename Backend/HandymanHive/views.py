from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

import json 

def index(request):
    return HttpResponse("Hello, world!")

#-------------------- USER AUTHENTICATION --------------
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user, created = User.objects.get_or_create(username=username)
        if created:
            user.set_password(password)
            user.save()
            return JsonResponse({'message': 'User created successfully'})
        else:
            return JsonResponse({'message': 'Username already exists'})

@csrf_exempt
def login(request):
    return JsonResponse({"message": "Login successfull"})   
    

