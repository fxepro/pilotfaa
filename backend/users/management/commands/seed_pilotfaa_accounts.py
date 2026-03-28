"""
Create or reset PilotFAA dev accounts (no raw SQL).

Usage:
    python manage.py seed_pilotfaa_accounts
    python manage.py seed_pilotfaa_accounts --password "YourSecurePassword"

Accounts:
    superuser  — Django superuser + staff; profile.role admin (API role is always admin for is_superuser)
    student    — profile role student (app login → /lms)
    tutor      — profile role analyst (no "tutor" role in model; analyst as stand-in)

Default password if omitted: PilotFAA123!
"""

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from users.models import UserProfile

User = get_user_model()


def _upsert(
    username: str,
    email: str,
    password: str,
    *,
    first_name: str,
    last_name: str,
    is_superuser: bool = False,
    is_staff: bool = False,
    profile_role: str,
) -> str:
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "is_staff": is_staff,
            "is_superuser": is_superuser,
            "is_active": True,
        },
    )
    if not created:
        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.is_active = True
    user.set_password(password)
    user.save()

    profile, _ = UserProfile.objects.get_or_create(
        user=user,
        defaults={
            "role": profile_role,
            "is_active": True,
            "email_verified": True,
        },
    )
    profile.role = profile_role
    profile.is_active = True
    profile.email_verified = True
    profile.save()

    return "created" if created else "updated"


class Command(BaseCommand):
    help = "Seed superuser, student, and tutor (analyst) accounts for PilotFAA dev"

    def add_arguments(self, parser):
        parser.add_argument(
            "--password",
            default="PilotFAA123!",
            help="Password for all three accounts (default: PilotFAA123!)",
        )

    def handle(self, *args, **options):
        pwd = options["password"]

        specs = [
            (
                "superuser",
                "superuser@pilotfaa.local",
                "Super",
                "User",
                True,
                True,
                "admin",
            ),
            (
                "student",
                "student@pilotfaa.local",
                "Student",
                "User",
                False,
                False,
                "student",
            ),
            (
                "tutor",
                "tutor@pilotfaa.local",
                "Tutor",
                "User",
                False,
                False,
                "analyst",
            ),
        ]

        for username, email, fn, ln, is_su, is_st, role in specs:
            action = _upsert(
                username,
                email,
                pwd,
                first_name=fn,
                last_name=ln,
                is_superuser=is_su,
                is_staff=is_st,
                profile_role=role,
            )
            self.stdout.write(self.style.SUCCESS(f"{username}: {action} (profile role={role})"))

        self.stdout.write("")
        self.stdout.write("Log in at /workspace/login with any of:")
        self.stdout.write(f"  superuser / {pwd}")
        self.stdout.write(f"  student   / {pwd}")
        self.stdout.write(f"  tutor     / {pwd}")
