from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SessionViewSet, AttendeeViewSet, 
    CheckAttendeeSessionsView, RegisterAttendeeView, CreateSessionView
)

router = DefaultRouter()
router.register(r'sessions', SessionViewSet, basename='session')
router.register(r'attendees', AttendeeViewSet, basename='attendee')

urlpatterns = [
    path('', include(router.urls)),  # CRUD endpoints for Sessions & Attendees
    path('check-attendee-sessions/', CheckAttendeeSessionsView.as_view(), name='check-attendee-sessions'),
    path('register-attendee/', RegisterAttendeeView.as_view(), name='register-attendee'),
    path('create-session/', CreateSessionView.as_view(), name='create-session')
]
