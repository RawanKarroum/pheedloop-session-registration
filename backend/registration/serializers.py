from rest_framework import serializers
from .models import Session, Attendee

# Serializer for Session Model
class SessionSerializer(serializers.ModelSerializer):
    """
    Serializer for Session model.
    """

    duration = serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = ['id', 'title', 'start_time', 'end_time', 'description', 'duration']
        read_only_fields = ['duration']

    def get_duration(self, obj):
        """
        Compute session duration in minutes.
        """
        return (obj.end_time - obj.start_time).total_seconds() // 60

# Serializer for Attendee Model
class AttendeeSerializer(serializers.ModelSerializer):
    """
    Serializer for Attendee model.
    """

    class Meta:
        model = Attendee
        fields = ['id', 'name', 'email', 'job_title', 'sessions']

    def validate_sessions(self, sessions):
        """
        Field-level validation: Check for time conflicts in selected sessions.
        """
        session_times = []
        for session in sessions:
            for start, end in session_times:
                if session.start_time < end and session.end_time > start:
                    raise serializers.ValidationError(
                        f"Session '{session.title}' conflicts with another selected session."
                    )
            session_times.append((session.start_time, session.end_time))
        return sessions

    def validate(self, attrs):
        """
        Object-level validation: Ensure email contains '@'.
        """
        email = attrs.get('email', '')
        if '@' not in email:
            raise serializers.ValidationError({'email': "Invalid email format."})
        return attrs

    def create(self, validated_data):
        """
        Create a new attendee.
        """
        return Attendee.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update an existing attendee.
        """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
