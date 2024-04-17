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
from .notifications import send_notfication

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
                "verified": worker.verified,
                "address":worker.address,
                "state":worker.state,
                "latitude":worker_details.liveLatitude,
                "longitude":worker_details.liveLongitude,
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
        send_notfication("Request Work", worker, {"service": service, "user": user.first_name})
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
            status = data.get("status")
            print("worker",worker,"user",user,"service",service)
            request = Request.objects.get(
                user=user, worker=worker, service=service
            )
            print(1)
            request.delete()
            
            if status== "Accept":
                WorkHistory.objects.create(
                    user=user,
                    worker=worker,
                    service=service,
                    started_on=timezone.now(),
                )
            send_notfication("Accepted Work", user, {"service": service, "user": worker.first_name})
            return JsonResponse(
                {"message": "Request deleted and added to WorkHistory successfully"}
            )
        except Exception as e:
            print(e)
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
def get_progress_works(request):
    if request.method == 'POST':
        print(1)
        try:
            
            data = json.loads(request.body)
            email = data.get("email")
            print(email)
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
            
            print(worker_progress_works)

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
                if status == "Reject":
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



@csrf_exempt
def get_worker_history(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            worker = CustomWorker.objects.get(email=email)
            work_histories = WorkHistory.objects.filter(worker=worker, status="Done")
            print(2)
            worker_work_histories = []
            for work in work_histories:
                worker_work_histories.append(
                    {
                        "first_name": work.user.first_name,
                        "last_name": work.user.last_name,
                        "email": work.user.email,
                        "service": work.service,
                        "started_on": work.started_on,
                        "done_on": work.done_on,
                    }
                )
            print(1)
            return JsonResponse({"work_histories": worker_work_histories})
        except CustomWorker.DoesNotExist:
            return JsonResponse({"error": "Worker not found"}, status=404)
        except Exception as e:
            return JsonResponse(
                {"error": f"Error fetching work history: {e}"}, status=500
            )
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)



@csrf_exempt
def get_user_history(request):
    if request.method == 'POST':
        
        try:
            
            data = json.loads(request.body)
            email = data.get("email")  # user email
            
            print(email)
            user = CustomUser.objects.get(email=email)
            progress_works = WorkHistory.objects.filter(
                user=user, status="In Progress"
            )

            user_progress_works = []
            

            for work in progress_works:
                user_progress_works.append(
                    {
                        "first_name": work.worker.first_name,
                        "last_name": work.worker.last_name,
                        "email": work.worker.email,
                        "service": work.service,
                        "started_on": work.started_on,
                        "status": work.status,
                    }
                )
            
            

            return JsonResponse({"progress_works": user_progress_works})
        except CustomWorker.DoesNotExist:
            return JsonResponse({"error": "Worker not found"}, status=404)
        except Exception as e:
            return JsonResponse(
                {"error": f"Error fetching progress work: {e}"}, status=500)
        
def fetch_timeline_details(request):
    try:
        # Load the JSON data from the request body
        request_data = json.loads(request.body)
        
        # Get the emails from the request data
        user_email = request_data.get('user_email')
        worker_email = request_data.get('worker_email')
        
        # Get the user and worker objects based on the provided emails
        user = CustomUser.objects.get(email=user_email)
        worker = CustomWorker.objects.get(email=worker_email)
        
        # Query work history events for the specific user and worker in progress
        timeline_events = WorkHistory.objects.filter(
            user=user,
            worker=worker,
            status="In Progress"
        ).order_by('started_on')

        # Serialize the data
        timeline_data = []
        for event in timeline_events:
            event_data = {
                'user_email': event.user.email,
                'worker_email': event.worker.email,
                'service': event.service,
                'status': event.status,
                'started_on': event.started_on.strftime('%Y-%m-%d %H:%M:%S') if event.started_on else None,
                'done_on': event.done_on.strftime('%Y-%m-%d %H:%M:%S') if event.done_on else None,
                'user_acceptance_time': event.user_acceptance_time.strftime('%Y-%m-%d %H:%M:%S') if event.user_acceptance_time else None,
                'worker_acceptance_time': event.worker_acceptance_time.strftime('%Y-%m-%d %H:%M:%S') if event.worker_acceptance_time else None,
                'userdone': event.userdone,
                'workerdone': event.workerdone,
                'review_by_user': event.review_by_user,
                'review_by_worker': event.review_by_worker
            }
            timeline_data.append(event_data)

        # Send the data back to the user
        return JsonResponse({'timeline_details': timeline_data})
    except (CustomUser.DoesNotExist, CustomWorker.DoesNotExist):
        return JsonResponse({'error': 'User or worker not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)