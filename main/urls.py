from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.home, name='home'),
	url(r'^venda/$', views.venda, name='venda'),
	url(r'^estoque/$', views.estoque, name='estoque'),
]
