from django.db import models
from django.contrib.auth.models import User
from budget.models import Budget
# from debt.models import Debt
from django.utils.translation import gettext as _
from django.core.mail import send_mail

from django.db.models.signals import post_save, pre_save, post_delete

GENDERS = (
    (1, 'Male'),
    (2, 'Female'),
    (3, 'Other'),
)
class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='profile')
    gender = models.IntegerField(_("Gender"), default=1, choices=GENDERS)
    city = models.CharField(_("City"), max_length=190, null=True, blank=True)
    country = models.CharField(_("Country"), max_length=190, null=True, blank=True)
    
    def __str__(self):
        return "Profile<{}> {}".format(self.pk, self.user)
        
def user_setup(sender, instance, created, *kargs, **kwargs):
    if created: # new 
        # create a sample budget 
        Budget.init_budget(instance)
        
        # create gds
        # Debt.init_debts(instance)
        
        #TODO: send notification 
        send_mail("New account registration", \
            "There is a new account registered: {} ({})".format(instance.username, instance.email), \
            None, ['huydo@grr.la'])
            
post_save.connect(user_setup, sender=User)