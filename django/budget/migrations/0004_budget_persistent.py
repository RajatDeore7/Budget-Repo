# Generated by Django 2.1.7 on 2021-08-05 03:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0003_budget_created_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='budget',
            name='persistent',
            field=models.BooleanField(default=False, verbose_name='Persistent'),
        ),
    ]
