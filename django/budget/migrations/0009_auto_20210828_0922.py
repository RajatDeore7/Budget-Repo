# Generated by Django 2.1.7 on 2021-08-28 09:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0008_auto_20210826_1352'),
    ]

    operations = [
        migrations.AlterField(
            model_name='budget',
            name='pie_title',
            field=models.CharField(blank=True, default='', max_length=190, verbose_name='Pie Title'),
        ),
        migrations.AlterField(
            model_name='budget',
            name='title',
            field=models.CharField(blank=True, default='Summary of Monthly Budgeted Expenses', max_length=190, verbose_name='Title'),
        ),
    ]
