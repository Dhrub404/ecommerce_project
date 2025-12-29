from django.core.management.base import BaseCommand
from products.models import Product, Category
from django.core.files import File
import os

class Command(BaseCommand):
    help = 'Seeds the database with initial products'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')
        
        # Categories
        electronics, _ = Category.objects.get_or_create(name='Electronics', slug='electronics')
        gaming, _ = Category.objects.get_or_create(name='Gaming', slug='gaming')
        fashion, _ = Category.objects.get_or_create(name='Fashion', slug='fashion')
        self.stdout.write('Categories created/verified.')

        products_data = [
            {
                'name': 'Canon EOS R3 DSLR Camera',
                'description': 'Professional mirrorless camera with high-speed shooting and advanced autofocus.',
                'price': 449999.00,
                'stock': 5,
                'category': electronics,
                'image': 'products/camera.png',
                'rating': 4.8,
                'numReviews': 12
            },
            {
                'name': 'PlayStation 5 Console',
                'description': 'Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.',
                'price': 49990.00,
                'stock': 10,
                'category': gaming,
                'image': 'products/console.png',
                'rating': 4.9,
                'numReviews': 45
            },
            {
                'name': 'Smart Fitness Watch Series 7',
                'description': 'Advanced health features. Measure your blood oxygen level. Take an ECG anytime, anywhere.',
                'price': 41900.00,
                'stock': 20,
                'category': electronics,
                'image': 'products/watch.png',
                'rating': 4.5,
                'numReviews': 28
            },
            {
                'name': 'Ultra Boost Running Shoes',
                'description': 'Responsive cushioning returns energy to your stride. The Primeknit upper wraps your foot in support.',
                'price': 14500.00,
                'stock': 15,
                'category': fashion,
                'image': 'products/shoes.png',
                'rating': 4.7,
                'numReviews': 34
            }
        ]

        for p_data in products_data:
            product, created = Product.objects.get_or_create(
                name=p_data['name'],
                defaults={
                    'description': p_data['description'],
                    'price': p_data['price'],
                    'stock': p_data['stock'],
                    'category': p_data['category'],
                    'image': p_data['image'],
                    'rating': p_data['rating'],
                    'numReviews': p_data['numReviews']
                }
            )
            if created:
                self.stdout.write(f"Created product: {p_data['name']}")
            else:
                self.stdout.write(f"Product already exists: {p_data['name']}")
        
        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
