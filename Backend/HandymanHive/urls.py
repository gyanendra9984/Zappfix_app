from django.urls import path
from .routes import *

urlpatterns = [
    path("user_signup", user_auth.user_signup, name="user_signup"),
    path("verify_otp", user_auth.verify_otp, name="verify_otp"),
    path("user_login", user_auth.user_login, name="user_login"),
    path("verify_login_otp", user_auth.verify_login_otp, name="verify_login_otp"),
    path("get_user_data", profile.get_user_data, name="get_user_data"),
    path("edit_personal_profile", profile.edit_personal_profile, name="edit_personal_profile"),
    path("upload_profile_pic", profile.upload_profile_pic, name="upload_profile_pic"),
    path("update_worker_location", profile.update_worker_location, name="update_worker_location"),
    path("delete_user", profile.delete_user, name='delete_user'),
    path("update_services", profile.update_services, name="update_service"),
    path("get_services", profile.get_services, name="get_services"),
    path("get_certificates", profile.get_certificates, name="get_certificates"),
    path("approve_certificate", profile.approve_certificate, name="approve_certificate"),
    path("upload_certificate", profile.upload_certificate, name="upload_certificate"),
    path("get_nearest_workers", recommendation.get_nearest_workers, name="get_nearest_workers"),
    path("get_workers_on_price", recommendation.get_workers_on_price, name="get_workers_on_price"),    
    path("get_closest_services", search.get_closest_services, name="get_closest_services"),
    path("user_last_five_queries",search.user_last_five_queries,name="user_last_five_queries"),
    path("insert_worker", search.insert_worker, name="insert_worker"),
    path("get_worker_profile", worker_history.get_worker_profile, name="get_worker_profile"),   
    path("create_request",worker_history.create_request,name="create_request"),
    path("get_user_requests", worker_history.get_user_requests, name="get_user_requests"), 
    path("update_request", worker_history.update_request, name="update_request"),
    path("dashboard_view",admin.dashboard_view,name="dashboard_view"),
    path("get_workers",profile.get_workers,name="get_workers"),
    path("change_verification_status",admin.change_verification_status,name="change_verification_status"),
    path("fetch_timeline_details",worker_history.fetch_timeline_details,name="fetch_timeline_details"),
    path("get_user_history",worker_history.get_user_history,name="get_user_history"),
    path("get_worker_history",worker_history.get_worker_history,name="get_worker_history"),
    path("update_worker_works",worker_history.update_worker_works,name="update_worker_works"),
    path("update_user_works",worker_history.update_user_works,name="update_user_works"),
    path("fetch_reviews",worker_history.fetch_reviews,name="fetch_reviews"),
    path("get_all_services", recommendation.get_all_services, name="get_all_services"),
    path("get_top_trending_services", recommendation.get_top_trending_services, name="get_top_trending_services")
]  

