from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Project

User = get_user_model()

class ProjectModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.user1 = User.objects.create_user(username='user1', password='password')
        cls.project1 = Project.objects.create(
            name='Test Project 1',
            description='This is a test project.',
            status='IN_PROGRESS',
            priority='MID',
            assigned_to=cls.user1,
            created_by=cls.user1
        )

    def test_project_creation(self):
        # Test if the project is created successfully
        self.assertEqual(self.project1.name, 'Test Project 1')
        self.assertEqual(self.project1.description, 'This is a test project.')
        self.assertEqual(self.project1.status, 'IN_PROGRESS')
        self.assertEqual(self.project1.priority, 'MID')
        self.assertEqual(self.project1.assigned_to, self.user1)
        self.assertEqual(self.project1.created_by, self.user1)

    def test_string_representation(self):
        # Test the string representation of the Project model
        self.assertEqual(str(self.project1), 'Test Project 1')

    def test_default_values(self):
        # Test if default values are set correctly
        project2 = Project.objects.create(
            name='Test Project 2',
            description='Another test project.',
            assigned_to=self.user1,
            created_by=self.user1
        )
        self.assertEqual(project2.status, 'IN_PROGRESS')
        self.assertEqual(project2.priority, 'MID')

    def test_status_choices(self):
        # Test if the status field choices are correct
        status_choices = [choice[0] for choice in Project.STATUS_CHOICES]
        self.assertIn(self.project1.status, status_choices)

    def test_priority_choices(self):
        # Test if the priority field choices are correct
        priority_choices = [choice[0] for choice in Project.PRIORITY_CHOICES]
        self.assertIn(self.project1.priority, priority_choices)

    def test_assigned_to_null(self):
        # Test if assigned_to can be null
        project3 = Project.objects.create(
            name='Test Project 3',
            description='Test project with null assigned_to',
            created_by=self.user1
        )
        self.assertIsNone(project3.assigned_to)

