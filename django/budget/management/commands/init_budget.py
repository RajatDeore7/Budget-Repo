from django.core.management.base import BaseCommand
from budget.models import Budget, CategoryItem, Category


class Command(BaseCommand):
    help = 'Init Budget'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        budget = Budget(name='Budget #1')
        budget.save()
        
        income = Category(name="Income", budget=budget, c_type=1, persistent=True)
        income.save()

        expense = Category(name="Expense", budget=budget, c_type=2, persistent=True)
        expense.save()

        budget.income = income
        budget.expense = expense
        budget.save()
