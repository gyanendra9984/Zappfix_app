from django.db import models
from django.contrib.auth.models import User

# User Profile. To be implemented
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)    
    bio = models.TextField()
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.user.username
    
    


