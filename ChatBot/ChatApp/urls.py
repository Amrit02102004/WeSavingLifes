from django.urls import path
from .views import get_next_char
from . import views

urlpatterns = [
    path('',views.index,name='index'),
    path('get_reply/', get_next_char, name='get_next_char'),
    
]
