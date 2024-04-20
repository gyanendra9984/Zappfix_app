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
def get_worker_history(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            worker = CustomWorker.objects.get(email=email)
            doneWorks = WorkHistory.objects.filter(worker=worker, status="Done")
            progressWorks = WorkHistory.objects.filter(worker=worker, status="In Progress")
            
            progress_works = []
            done_works = []
            
            for work in doneWorks:
                done_works.append(
                    {
                        "first_name": work.user.first_name,
                        "last_name": work.user.last_name,
                        "email": work.user.email,
                        "service": work.service,
                        "started_on": work.started_on,
                        "done_on": work.done_on, 
                        "status":"Done",
                        "showingStatus":"Done"                       
                    }
                )
            
            for work in progressWorks:
                status= 'In Progress'
                if work.workerdone:
                    status='Done'        
                    
                progress_works.append(
                    {
                        "first_name": work.user.first_name,
                        "last_name": work.user.last_name,
                        "email": work.user.email,
                        "service": work.service,
                        "started_on": work.started_on,   
                        "status": status,  
                        "status":"In Progress",
                        "showingStatus": status                   
                    }
                )           
            
            
            
            return JsonResponse({"progress_works": progress_works, "done_works": done_works})
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
            email = data.get("email")
            
            user = CustomUser.objects.get(email=email)
            doneWorks = WorkHistory.objects.filter(user=user, status="Done")
            progressWorks = WorkHistory.objects.filter(user=user, status="In Progress")
            
            progress_works = []
            done_works = []
            
            for work in doneWorks:
                progress_works.append(
                    {
                        "first_name": work.worker.first_name,
                        "last_name": work.worker.last_name,
                        "email": work.worker.email,
                        "service": work.service,
                        "started_on": work.started_on,
                        "done_on": work.done_on,
                        "status":"Done",
                        "showingStatus":"Done"
                    }
                )
                
            for work in progressWorks:
                status = 'In Progress'
                if work.userdone:
                    status = 'Done'
                    
                progress_works.append(
                    {
                        "first_name": work.worker.first_name,
                        "last_name": work.worker.last_name,
                        "email": work.worker.email,
                        "service": work.service,
                        "started_on": work.started_on,
                        "status":"In Progress",
                        "showingStatus": status
                    }
                )
                
            return JsonResponse({"progress_works": progress_works, "done_works": done_works})
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse(
                {"error": f"Error fetching progress work: {e}"}, status=500)
    
@csrf_exempt
def update_user_works(request):
    if request.method=='POST':        
        try:
        
            request_data = json.loads(request.body)
            user_email = request_data.get('user_email')
            worker_email = request_data.get('worker_email')
            service = request_data.get('service')
            status = request_data.get('status')           
            user_review = request_data.get('user_review') 
            user_rating = request_data.get('user_rating')           
            user = CustomUser.objects.get(email=user_email)
            worker = CustomWorker.objects.get(email=worker_email)
            
            
            work = WorkHistory.objects.get(
                user=user,
                worker=worker,
                service=service
            )
            
            if status=='Reject' and work.status=='In Progress':
                work.delete()
                return JsonResponse({'message': 'Work deleted successfully'})
            
            if status=='Done' and work.status=='In Progress':                
                work.userdone=True
                if work.workerdone:
                    work.done_on=timezone.now()
                    work.status='Done'
                    
                work.user_done_on=timezone.now()
                work.user_review = user_review
                work.user_rating = user_rating
                
                work.save()
                return JsonResponse({'message': 'Work accepted successfully'})
            
            return JsonResponse({'message': 'Status updated successfully'})
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'Error Updating the status'}, status=500)

    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def update_worker_works(request):
    if request.method=='POST':
        
        try:
            request = json.loads(request.body)
            
            user_email = request.get('user_email')
            worker_email = request.get('worker_email')
            service = request.get('service')
            status = request.get('status')
            
            
            user = CustomUser.objects.get(email=user_email)
            worker = CustomWorker.objects.get(email=worker_email)                    
            
            
            work = WorkHistory.objects.get(
                user=user,
                worker=worker,
                service=service
            )
            
            if status == 'Reject' and work.status == 'In Progress':
                work.delete()
                return JsonResponse({'message': 'Work deleted successfully'})
            
            if status == 'Done' and work.status == 'In Progress':
                work.workerdone = True
                if work.userdone:
                    work.done_on = timezone.now()
                    work.status = 'Done'
                work.worker_done_on = timezone.now()
                work.save()           
            

            return JsonResponse({'message': 'Status updated successfully'})
        except (CustomWorker.DoesNotExist, json.JSONDecodeError, WorkHistory.DoesNotExist):
            return JsonResponse({'error': 'Error fetching details'}, status=400)
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt    
def fetch_timeline_details(request):
    try:
        request_data = json.loads(request.body)
        
        
        user_email = request_data.get('user_email')
        worker_email = request_data.get('worker_email')
        service=request_data.get('service')
        
        
        user = CustomUser.objects.get(email=user_email)
        worker = CustomWorker.objects.get(email=worker_email)
        
        work = WorkHistory.objects.get(
            user=user,
            worker=worker,
            service=service
        )

        
        timeline_data = []
        print(work.started_on)
        timeline_data.append(
            {
                'time': work.started_on,
                'title': 'Work Started',                
            }            
        )
        if work.user_done_on:
            print(work.user_done_on)
            print('user')
            timeline_data.append(
                {
                    'time': work.user_done_on,                
                    'title': 'User marked the project as Done',                
                }            
            )       
        
        
            # timeline_data.append(
            #     {
            #         'time': work.user_done_on,                
            #         'title': f'User gave review {work.user_review} and rating {work.user_rating}',           
            #     }            
            # )

        if work.worker_done_on:
            print('worker')
            timeline_data.append(
                {
                    'time': work.worker_done_on,                
                    'title': 'Worker marked the project as Done',                
                }
            )

        if work.done_on:
            print('done')
            timeline_data.append(
                {
                    'time': work.done_on,                
                    'title': 'Work Completed',
                }
            )
        
        # timeline_data.sort(key=lambda x: x['time'])
        
        return JsonResponse({'timeline_details': timeline_data})
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Error fetching details'}, status=500)