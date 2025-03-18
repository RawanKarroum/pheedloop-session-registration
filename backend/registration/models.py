from django.db import models

class Session(models.Model):
    title = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.start_time} - {self.end_time})"


class Attendee(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    job_title = models.CharField(max_length=100)
    sessions = models.ManyToManyField(Session)

    def __str__(self):
        return f"{self.name} - {self.email}"
