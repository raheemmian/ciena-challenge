from django.urls import path 
from . import views

urlpatterns = [
    path('', views.home, name='osa-home'),
    path('single', views.single, name='osa-single'),
    path('start', views.start, name='osa-start'),
    path('stop', views.stop, name='osa-stop')
]