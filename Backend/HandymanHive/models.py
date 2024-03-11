from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import User


class OTPModel(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_valid_till = models.DateTimeField(null=True, blank=True)
    worker_details = models.TextField(null=True, blank=True)    

    def __str__(self):
        return self.email

class CustomWorkerManager(BaseUserManager):
    def create_user(self, email, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_unusable_password()
        user.save(using=self._db)
        return user
    def create_superuser(self, email, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        user= self.create_user(email, **extra_fields)
        user.save()
        return user

# Model to store worker profile.
class CustomWorker(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(primary_key=True,max_length=255, unique=True) 
    phone_number = models.CharField(max_length=15, unique=True)    
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)   
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    otp= models.CharField(max_length=6, null=True, blank=True)
    otp_valid_till = models.DateTimeField(null=True, blank=True)    
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False) 
      
    objects = CustomWorkerManager()

    USERNAME_FIELD = 'email'
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


class CustomUserManager(BaseUserManager):
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


# Model to store user profile.
class CustomUser(AbstractBaseUser, PermissionsMixin):
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
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "gender"]

    def __str__(self):
        return self.email
