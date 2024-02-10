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
 if request.method == 'POST':
    data = json.loads(request.body)
    username=data.get('username')
    password=data.get('password')
    user=auth.authenticate(username=username,password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'message': 'Login successful'})
    else:
        return JsonResponse({'message': 'Invalid login credentials'})

    

