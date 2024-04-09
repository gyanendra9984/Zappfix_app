from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from ..models import (
    CustomUser,
    CustomWorker,
    Certification,
    WorkerDetails,
    Request,
    WorkHistory,
)
import json


###################### REQUEST PAGE ROUTES #############################

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


        Request.objects.create(
            user=user,
            worker=worker,
            service=service,
            created_on=timezone.now(),
        )

        return JsonResponse({'status': 'success', 'message': 'Request created successfully'})

    else:
        return JsonResponse(
            {"status": "error", "message": "Only POST requests are allowed"}, status=405
        )



@csrf_exempt
def update_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_email = data.get("user_email")
            worker_email = data.get("worker_email")
            user = CustomUser.objects.get(email=user_email)
            worker = CustomWorker.objects.get(email=worker_email)
            service = data.get("service")
            status = data.get("status","In Progress")

            request = Request.objects.get(
                user=user, worker=worker, service=service
            )

            request.delete()

            WorkHistory.objects.create(
                user=user,
                worker=worker,
                service=service,
                status=status,
                started_on=timezone.now(),
            )

            return JsonResponse(
                {"message": "Request deleted and added to WorkHistory successfully"}
            )
        except Exception as e:
            return JsonResponse({"error": "Error updating request"}, status=500)
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
            requests = Request.objects.filter(worker=worker, status='Pending')

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



########################### WORKER HISTORY ROUTES #############################

@csrf_exempt
def get_progress_work(request):
    if request.method == "GET":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            worker = CustomWorker.objects.get(email=email)
            progress_works = WorkHistory.objects.filter(
                worker=worker, status="In Progress"
            )

            worker_progress_works = []
            for work in progress_works:
                worker_progress_works.append(
                    {
                        "first_name": work.user.first_name,
                        "last_name": work.user.last_name,
                        "email": work.user.email,
                        "service": work.service,
                        "started_on": work.started_on,
                        "status": work.status,
                    }
                )

            return JsonResponse({"progress_works": worker_progress_works})
        except CustomWorker.DoesNotExist:
            return JsonResponse({"error": "Worker not found"}, status=404)
        except Exception as e:
            return JsonResponse(
                {"error": f"Error fetching progress work: {e}"}, status=500)

              
@csrf_exempt
def update_work_history(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_email = data.get("user_email")
            worker_email = data.get("worker_email")
            user = CustomUser.objects.get(email=user_email)
            worker = CustomWorker.objects.get(email=worker_email)
            service = data.get("service")
            status = data.get("status","In Progress")
            userdone = data.get("userdone", False)
            workerdone = data.get("workerdone", False)

            work_history = WorkHistory.objects.get(
                user=user, worker=worker, service=service
            )

            if work_history:
                if status == "rejected":
                    work_history.delete()
                    return JsonResponse(
                        {"message": "Work history entry deleted successfully"}
                    )
                if userdone == True:
                    work_history.userdone = userdone
                if workerdone == True:
                    work_history.workerdone = workerdone

                if work_history.userdone and work_history.workerdone:
                    work_history.status = "Done"
                    work_history.done_on = timezone.now()

                work_history.save()

                return JsonResponse({"message": "Work history updated successfully"})
            else:
                return JsonResponse(
                    {"error": "Work history entry not found"}, status=404
                )
        except Exception as e:
            return JsonResponse(
                {"error": f"Error updating work history: {str(e)}"}, status=500
            )
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


