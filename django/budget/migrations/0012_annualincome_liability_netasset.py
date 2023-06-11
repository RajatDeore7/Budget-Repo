# Generated by Django 2.1.7 on 2021-12-21 15:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0011_auto_20210928_1407'),
    ]

    operations = [
        migrations.CreateModel(
            name='AnnualIncome',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(db_index=True, editable=False, verbose_name='order')),
                ('name', models.CharField(max_length=150, verbose_name='Name')),
                ('yearly', models.DecimalField(decimal_places=2, default=0, max_digits=13, verbose_name='Yearly Amount')),
                ('budget', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='annual_incomes', to='budget.Budget')),
            ],
            options={
                'ordering': ['order', 'pk'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Liability',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(db_index=True, editable=False, verbose_name='order')),
                ('name', models.CharField(max_length=150, verbose_name='Name')),
                ('description', models.CharField(blank=True, default='', max_length=190, verbose_name='Description')),
                ('limit', models.DecimalField(decimal_places=2, default=0, max_digits=13, verbose_name='Limit')),
                ('balance', models.DecimalField(decimal_places=2, default=0, max_digits=13, verbose_name='Balance')),
                ('monthly', models.DecimalField(decimal_places=2, default=0, max_digits=13, verbose_name='Monthly')),
                ('yearly', models.DecimalField(decimal_places=2, default=0, max_digits=13, verbose_name='Yearly')),
                ('budget', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='liabilities', to='budget.Budget')),
            ],
            options={
                'ordering': ['order', 'pk'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='NetAsset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(db_index=True, editable=False, verbose_name='order')),
                ('name', models.CharField(max_length=150, verbose_name='Name')),
                ('description', models.CharField(blank=True, default='', max_length=190, verbose_name='Description')),
                ('yearly', models.DecimalField(decimal_places=2, default=0, max_digits=13, verbose_name='Yearly Amount')),
                ('budget', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='netassets', to='budget.Budget')),
            ],
            options={
                'ordering': ['order', 'pk'],
                'abstract': False,
            },
        ),
    ]