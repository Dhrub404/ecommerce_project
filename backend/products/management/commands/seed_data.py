from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Category, Product

class Command(BaseCommand):
    help = 'Seed the database with sample categories, products, and a test user.'

    def handle(self, *args, **options):
        User = get_user_model()
        # Create test user
        if not User.objects.filter(username='devuser').exists():
            User.objects.create_user('devuser', email='devuser@example.com', password='devpass123')
            self.stdout.write(self.style.SUCCESS('Created test user devuser/devpass123'))
        else:
            self.stdout.write('Test user already exists')

        # Create category
        cat, created = Category.objects.get_or_create(name='Device', slug='device')
        if created:
            self.stdout.write(self.style.SUCCESS('Created category Device'))

        # Create sample products
        sample_products = [
            {'name': 'Sample Phone', 'description': 'A sample phone', 'price': 499.99, 'stock': 10},
            {'name': 'Sample Laptop', 'description': 'A sample laptop', 'price': 1299.99, 'stock': 5},
            {'name': 'Sample Headphones', 'description': 'Noise cancelling', 'price': 199.99, 'stock': 20},
        ]

        for sp in sample_products:
            prod, created = Product.objects.get_or_create(name=sp['name'], defaults={
                'description': sp['description'],
                'price': sp['price'],
                'stock': sp['stock'],
                'category': cat,
                'is_active': True,
            })
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created product {prod.name}"))
            else:
                self.stdout.write(f"Product {prod.name} already exists")

        self.stdout.write(self.style.SUCCESS('Seeding completed'))