from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import User


class WorkerManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('The phone number field must be set')
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone_number, password, **extra_fields)


# Model to store worker profile.
class CustomWorker(AbstractBaseUser, PermissionsMixin):
    phone_number = models.CharField(max_length=15, unique=True, primary_key=True)    
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    email = models.EmailField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = WorkerManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'gender']

    def __str__(self):
        return self.email

class Service(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, help_text="Description of the service")   
    

class Certification(models.Model):    
    name = models.CharField(max_length=255, help_text="Name of the certification")
    issuing_authority = models.CharField(max_length=255, help_text="Issuing authority for the certification")


class Location(models.Model):
    city = models.CharField(max_length=50)
    neighborhood = models.CharField(max_length=50, blank=True, null=True, help_text="Neighborhood within the city")
    street_address = models.CharField(max_length=255, blank=True, null=True, help_text="Street address within the neighborhood")
    zip_code = models.CharField(max_length=10, blank=True, null=True, help_text="ZIP code")
    
    
# Model to store professional details of workers.
class WorkerDetails(models.Model): 
    worker = models.OneToOneField(CustomWorker, on_delete=models.CASCADE)
    
    # Services and Skills
    services_offered = models.ManyToManyField(Service, related_name='workers')
    skill_level = models.IntegerField()
    
    isAvailable = models.BooleanField(default=True)        

    # Work Experience
    work_history = models.TextField()
    years_of_experience = models.IntegerField()

    # Reviews and Ratings
    customer_reviews = models.TextField()
    overall_rating = models.FloatField()

    # Certifications and Qualifications
    certifications = models.ManyToManyField(Certification, related_name='workers')
    training_programs_completed = models.TextField()

    # Preferred Job Locations
    preferred_locations = models.ManyToManyField(Location, related_name='workers')

    # Price Range
    min_price = models.DecimalField(max_digits=10, decimal_places=2)
    max_price = models.DecimalField(max_digits=10, decimal_places=2)

    
    
  

 
    
    


