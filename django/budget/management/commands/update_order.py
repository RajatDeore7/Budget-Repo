from django.core.management.base import BaseCommand
from budget.models import Budget, Category
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Update Order'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        users = User.objects.all()
        for u in users:
            budgets = Budget.objects.filter(created_by=u)
            i = 1
            for budget in budgets:
                budget.order = i
                i = i + 1
                budget.save()
                j = 1
                categories = Category.objects.filter(budget=budget)
                for c in categories:
                    c.order = j 
                    j = j + 1
                    c.save()
        