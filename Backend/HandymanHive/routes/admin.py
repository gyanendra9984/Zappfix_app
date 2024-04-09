from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import (
    CustomUser,
    CustomWorker,
    Request,
)

adminlist=["2021csb1062@iitrpr.ac.in","2021csb1124@iitrpr.ac.in","alankritkadian@gmail.com"]


@csrf_exempt
def dashboard_view(request):
    # Count number of users
    num_users = CustomUser.objects.count()

    # Count number of workers
    num_workers = CustomWorker.objects.count()

    # Count number of verified workers
    num_verified_workers = CustomWorker.objects.filter(verified=True).count()

    # Count number of completed tasks
    num_completed_tasks = Request.objects.filter(status='Completed').count()

    data = {
        'num_users': num_users,
        'num_workers': num_workers,
        'num_verified_workers': num_verified_workers,
        'num_completed_tasks': num_completed_tasks
    }
    return JsonResponse(data)