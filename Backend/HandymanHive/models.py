from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import User
# from django.contrib.gis.db import models


class AbstractUserManager(BaseUserManager):
    def create_user(self, email, **extra_fields):
        if not email:
            raise ValueError(_("The Email field must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        user = self.create_user(email, **extra_fields)
        user.save()
        return user


class AbstractUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(primary_key=True, max_length=255, unique=True)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_valid_till = models.DateTimeField(null=True, blank=True)
    user_details = models.TextField(null=True, blank=True)
    is_worker = models.BooleanField(null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = AbstractUserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email


# Model to store worker profile.
class CustomWorker(models.Model):
    email = models.EmailField(primary_key=True, max_length=255, unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_valid_till = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.email


class CustomUser(models.Model):
    email = models.EmailField(primary_key=True, max_length=255, unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_valid_till = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.email


class Service(models.Model):
    name = models.CharField(max_length=50, primary_key=True)
    description = models.TextField(blank=True, help_text="Description of the service")
    
    def __str__(self):
        return self.name  
     


class Certification(models.Model):    
    name = models.CharField(max_length=255, primary_key=True, help_text="Name of the certification")
    issuing_authority = models.CharField(max_length=255, help_text="Issuing authority for the certification")
    
    def __str__(self):
        return self.name 


# Model to store professional details of workers.
class WorkerDetails(models.Model): 
    email = models.EmailField(primary_key=True, max_length=255, unique=True)

    # Services and Skills
    services_offered = models.ManyToManyField(Service, related_name='workers')
    skill_level = models.IntegerField(default=0)

    isAvailable = models.BooleanField(default=True)
    liveLatitude = models.FloatField()
    liveLongitude = models.FloatField()
    
    # Preferred Job Locations
    preferred_location = models.TextField(blank=True)          

    # Work Experience
    work_history = models.TextField(blank=True)
    years_of_experience = models.IntegerField(default=0)

    # Reviews and Ratings
    customer_reviews = models.TextField(blank=True)
    overall_rating = models.FloatField(default=0.0)

    # Certifications and Qualifications
    certifications = models.ManyToManyField(Certification, related_name='workers')
    training_programs_completed = models.TextField(blank=True)

    # Price Range
    min_price = models.DecimalField(max_digits=10, decimal_places=2, default = 0.0)
    max_price = models.DecimalField(max_digits=10, decimal_places=2, default = 0.0)
