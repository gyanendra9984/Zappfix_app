from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("user_signup", views.user_signup, name="user_signup"),
    path("verify_otp", views.verify_otp, name="verify_otp"),
    path("user_login", views.user_login, name="user_login"),
    path("verify_login_otp", views.verify_login_otp, name="verify_login_otp"),
    path("edit_personal_profile", views.edit_personal_profile, name="edit_personal_profile"),
    path("edit_worker_profile", views.edit_worker_profile, name="edit_worker_profile"),
    path('delete_user', views.delete_user, name='delete_user'),
    path("get_user_data", views.get_user_data, name="get_user_data"),
    
]  

