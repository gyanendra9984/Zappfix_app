from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("worker_signup", views.worker_signup, name="worker_signup"),
    path("user_signup", views.worker_signup, name="user_signup"),
    path("worker_login", views.worker_login, name="worker_login"),
    path("verify_otp", views.verify_otp, name="verify_otp"),
    path("verify_user_otp", views.verify_otp, name="verify_user_otp"),
    path("delete_entry", views.delete_entry, name="delete_entry"),
    path("verify_login_otp", views.verify_login_otp, name="verify_login_otp"),
    path(
        "edit_worker_personal_profile",
        views.edit_worker_personal_profile,
        name="edit_worker_personal_profile",
    ),
]
