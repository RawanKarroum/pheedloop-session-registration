from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Session, Attendee
from .serializers import SessionSerializer, AttendeeSerializer

# ViewSet for Sessions (CRUD)
class SessionViewSet(viewsets.ModelViewSet):
    """
    API endpoint to view or edit sessions.
    """
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

# ViewSet for Attendees (CRUD)
class AttendeeViewSet(viewsets.ModelViewSet):
    """
    API endpoint to view or edit attendees.
    """
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer

# Custom View to Check an Attendee's Registered Sessions
class CheckAttendeeSessionsView(APIView):
    """
    Returns a list of sessions registered by a given attendee.
    """

    def post(self, request):
        try:
            email = request.data.get("email")
            if not email:
                return Response({"error": "Email is required"}, status=400)

            attendee = Attendee.objects.filter(email=email).first()
            if not attendee:
                return Response({"error": "Attendee not found"}, status=404)

            sessions = attendee.sessions.all()
            session_data = SessionSerializer(sessions, many=True).data

            return Response({"sessions": session_data}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)

# Custom View to Register an Attendee and Prevent Overlapping Sessions
class RegisterAttendeeView(APIView):
    """
    Registers an attendee while preventing overlapping sessions.
    """

    def post(self, request):
        try:
            data = request.data
            name = data.get("name")
            email = data.get("email")
            job_title = data.get("job_title")
            session_ids = data.get("sessions", [])

            if not name or not email:
                return Response({"error": "Name and email are required"}, status=400)

            sessions = Session.objects.filter(id__in=session_ids)

            # Check for session time conflicts
            session_times = []
            for session in sessions:
                for start, end in session_times:
                    if session.start_time < end and session.end_time > start:
                        return Response(
                            {"error": f"Session '{session.title}' conflicts with another selected session."},
                            status=400
                        )
                session_times.append((session.start_time, session.end_time))

            # Check if attendee exists or create a new one
            attendee, created = Attendee.objects.get_or_create(email=email, defaults={
                "name": name,
                "job_title": job_title,
            })

            # Update attendee's sessions
            attendee.sessions.set(sessions)
            attendee.save()

            message = "Attendee registered successfully" if created else "Attendee updated successfully"
            return Response({"message": message}, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
# Custom View to Create a New Session
class CreateSessionView(APIView):
    """
    API endpoint to create a new session.
    """
    
    def post(self, request):
        try:
            data = request.data
            title = data.get("title")
            start_time = data.get("start_time")
            end_time = data.get("end_time")
            description = data.get("description", "")

            if not title or not start_time or not end_time:
                return Response({"error": "Title, start_time, and end_time are required"}, status=400)

            # Create the session
            session = Session.objects.create(
                title=title,
                start_time=start_time,
                end_time=end_time,
                description=description
            )

            return Response({"message": "Session created successfully", "session_id": session.id}, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=400)
