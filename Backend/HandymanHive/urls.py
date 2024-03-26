from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("user_signup", views.user_signup, name="user_signup"),
    path("verify_otp", views.verify_otp, name="verify_otp"),
    path("user_login", views.user_login, name="user_login"),
    path("verify_login_otp", views.verify_login_otp, name="verify_login_otp"),
    path("edit_personal_profile", views.edit_personal_profile, name="edit_personal_profile"),
    path("update_services", views.update_services, name="update_service"),
    path("get_services", views.get_services, name="get_services"),
    path("get_certificates", views.get_certificates, name="get_certificates"),
    path("upload_certificate", views.upload_certificate, name="upload_certificate"),
    path('delete_user', views.delete_user, name='delete_user'),
    path("get_user_data", views.get_user_data, name="get_user_data"),
    path("get_nearest_workers", views.get_nearest_workers, name="get_nearest_workers"),
    path("insert_worker", views.insert_worker, name="insert_worker"),
    path("get_workers_on_price", views.get_workers_on_price, name="get_workers_on_price"),
    path("get_closest_services", views.get_closest_services, name="get_closest_services"),
    path("user_last_five_queries",views.user_last_five_queries,name="user_last_five_queries"),
    path("update_worker_location", views.update_worker_location, name="update_worker_location"),
]  

