from django.core.management.base import BaseCommand
from faker import Faker
from django.contrib.auth import get_user_model
from api.models import Project

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed the database with fake users and projects'

    def handle(self, *args, **kwargs):
        faker = Faker()
        self.stdout.write(self.style.SUCCESS('Seeding data...'))

        # Create fake users
        for _ in range(10):  
            user = User.objects.create_user(
                username=faker.user_name(),
                email=faker.email(),
                password='password123',  
            )
            self.stdout.write(self.style.SUCCESS(f'Created user: {user.username}'))

        # Create fake projects
        users = User.objects.all()
        for _ in range(20):  
            project = Project.objects.create(
                name=faker.sentence(nb_words=3),
                description=faker.paragraph(nb_sentences=5),
                status=faker.random_element(elements=['IN_PROGRESS', 'DONE', 'ABANDONED', 'CANCELED']),
                priority=faker.random_element(elements=['LOW', 'MID', 'HIGH']),
                assigned_to=faker.random_element(users),
                created_by=faker.random_element(users),
            )
            self.stdout.write(self.style.SUCCESS(f'Created project: {project.name}'))

        self.stdout.write(self.style.SUCCESS('Seeding complete!'))
