from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt



def index(request):
    return HttpResponse("Hello, world!")

#-------------------- USER AUTHENTICATION --------------
@csrf_exempt
def signup(request):
    return JsonResponse({"message": "Signup successfull"})


@csrf_exempt
def login(request):
    return JsonResponse({"message": "Login successfull"})   
    

