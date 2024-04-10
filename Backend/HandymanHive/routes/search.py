from django.db.models import Q
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import (
    CustomUser,
    CustomWorker,
    Service,
    WorkerDetails,
)
import json
import random
import string
from .hfcb import HuggingChat as HCA
import os

llm = HCA(email=os.getenv("HF_EMAIL"), psw=os.getenv("HF_PASSWORD"), cookie_path="./cookies_snapshot")


############################ SEARCH FUNCTIONALITY ########################


@csrf_exempt
def get_closest_services(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get("query")
            email = data.get("email")
            user = CustomUser.objects.get(email=email)
            # Add the query using the add_query method
            user.add_query(query)
            user.save()
            
            nlp = spacy.load("en_core_web_md")

            query_tokens = [
                token.text
                for token in nlp(query)
                if not token.is_stop and not token.is_punct
            ]
            # print(query_tokens)
            print([token.vector for token in nlp(" ".join(query_tokens))])
            query_embedding = np.mean(
                [token.vector for token in nlp(" ".join(query_tokens))], axis=0
            )
            # print(query_embedding)

            services = Service.objects.all()

            similarities = []
            for service in services:
                # print(service.name)
                service_tokens = [
                    token.text
                    for token in nlp(service.name)
                    if not token.is_stop and not token.is_punct
                ]
                service_embedding = np.mean(
                    [token.vector for token in nlp(" ".join(service_tokens))], axis=0
                )
                similarity = cosine_similarity([query_embedding], [service_embedding])[
                    0
                ][0]
                similarities.append(similarity)

            service_pairs = zip(similarities, services)

            desired_services = sorted(service_pairs, key=lambda x: x[0], reverse=True)[
                :10
            ]

            closest_services = []
            for similarity, service in desired_services:
                closest_services.append({"name": service.name})

            closest_workers = []
            workers = CustomWorker.objects.filter(
                Q(first_name__icontains=query) | Q(last_name__icontains=query)
            )[:5]

            for worker in workers:
                closest_workers.append(
                    {
                        "first_name": worker.first_name,
                        "last_name": worker.last_name,
                        "email": worker.email,
                    }
                )

            return JsonResponse(
                {"services": closest_services, "workers": closest_workers}
            )

        except Exception as e:
            print(e)
            return JsonResponse({"error": "Error fetching service"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def user_last_five_queries(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            user = CustomUser.objects.get(email=email)
            last_five_queries = user.get_last_five_queries()
            return JsonResponse({"last_five_queries": last_five_queries})
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "Email does not exist"}, status=404)
    else:
        return JsonResponse({"error": "Invalid Request Method"}, status=400)


################################## HELPER FUNCTIONS ####################################
@csrf_exempt
def insert_worker(request):
    try:
        SERVICES = [
            "Plumbing",
            "Electrical",
            "Carpentry",
            "Painting",
            "Landscaping",
            "Gardening",
            "Roofing",
            "Flooring",
            "HVAC (Heating, Ventilation, and Air Conditioning)",
            "Appliance Repair",
            "Window Cleaning",
            "Pressure Washing",
            "Pest Control",
            "Home Security Installation",
            "Drywall Repair",
            "Furniture Assembly",
            "Interior Design",
            "Home Cleaning",
            "Carpet Cleaning",
            "Masonry",
            "Fence Installation",
            "Deck Construction",
            "Gutter Cleaning",
            "Tree Trimming",
            "Pool Maintenance",
            "Locksmith",
            "Garage Door Repair",
            "Water Damage Restoration",
            "Kitchen Remodeling",
            "Bathroom Remodeling",
            "Home Theater Installation",
            "Home Automation",
            "Solar Panel Installation",
            "Septic Tank Services",
            "Exterior Painting",
            "Siding Installation",
            "Wallpaper Removal",
            "Home Insulation",
            "Chimney Cleaning",
            "Foundation Repair",
            "Basement Waterproofing",
            "Drain Cleaning",
            "Welding Services",
            "Elevator Installation",
            "Bathtub Refinishing",
            "Countertop Installation",
            "Ceiling Fan Installation",
            "Fireplace Installation",
            "Shower Installation",
            "Security Camera Installation",
            "Ceiling Repair",
            "Home Renovation",
            "Shed Construction",
        ]
        FIRST = [
            "James",
            "John",
            "Robert",
            "Michael",
            "William",
            "David",
            "Richard",
            "Joseph",
            "Charles",
            "Thomas",
            "Mary",
            "Jennifer",
            "Linda",
            "Patricia",
            "Elizabeth",
            "Barbara",
            "Susan",
            "Jessica",
            "Sarah",
            "Karen",
            "Daniel",
            "Matthew",
            "Anthony",
        ]

        LAST = [
            "Smith",
            "Johnson",
            "Williams",
            "Jones",
            "Brown",
            "Davis",
            "Miller",
            "Wilson",
            "Moore",
            "Taylor",
            "Anderson",
            "Thomas",
            "Jackson",
            "White",
            "Harris",
            "Martin",
            "Thompson",
            "Garcia",
            "Martinez",
            "Robinson",
            "Clark",
            "Rodriguez",
            "Lewis",
            "Lee",
        ]
        for i in FIRST:
            for j in LAST:

                try:
                    phone_number = "".join(random.choices(string.digits, k=10))
                    first_name = i
                    last_name = j
                    email = f"{first_name.lower()}.{last_name.lower()}@gmail.com"
                    age = "25"
                    gender = "Male"
                    address = "address"
                    city = "city"
                    state = "city"
                    zip_code = "zip_code"
                    num_services = random.randint(1, len(SERVICES))
                    services = random.sample(SERVICES, num_services)
                    latitude = round(random.uniform(30.8, 31.2), 4)
                    longitude = round(random.uniform(76.4, 76.8), 4)


                    if CustomWorker.objects.filter(email=email).exists():
                        worker = CustomWorker.objects.get(email=email)  
                    else:
                        worker = CustomWorker.objects.get_or_create(
                            phone_number=phone_number,
                            first_name=first_name,
                            last_name=last_name,
                            email=email,
                            age=age,
                            gender=gender,
                            address=address,
                            city=city,
                            state=state,
                            zip_code=zip_code,
                        )
        
                    try: 
                        worker_details = WorkerDetails.objects.create(
                            email=email,
                            liveLatitude=latitude,
                            liveLongitude=longitude                                
                        )
                    except:
                        worker_details=WorkerDetails.objects.get(email=email)
                        
        
                    for serv in SERVICES:
                        print(serv)
                        if Service.objects.filter(name=serv).exists():
                            print(1)
                            service = Service.objects.get(name=serv)
                        else:
                            print(2)
                            service = Service.objects.create(name=serv)

                                           
                            
                        
                        worker_details.services_offered.add(service)
                

                    worker_details.save()
                    worker.save()
                except Exception as e:
                    print(e)
                    pass
        return JsonResponse({"message": "Worker added successfully"})

    except Exception as e:
        print(e)
        return JsonResponse({"error": "Error adding worker"}, status=500)
