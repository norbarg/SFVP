from django.contrib import admin
from django.shortcuts import redirect
from django.urls import include, path

urlpatterns = [
    path(
        "admin/",
        admin.site.urls,
    ),
    path(
        "routes/",
        include("routes.urls"),
    ),
    path(
        "",
        lambda request: redirect("routes_index"),
    ),
]
