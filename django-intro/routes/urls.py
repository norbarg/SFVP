from django.urls import path

from . import views

urlpatterns = [
    path(
        "",
        views.route_list,
        name="routes_index",
    ),
    path(
        "new/",
        views.route_create,
        name="routes_new",
    ),
    path(
        "<int:pk>/",
        views.route_show,
        name="routes_show",
    ),
    path(
        "<int:pk>/edit/",
        views.route_edit,
        name="routes_edit",
    ),
    path(
        "<int:pk>/delete/",
        views.route_delete,
        name="routes_delete",
    ),
    path(
        "countries/",
        views.country_list,
        name="countries_index",
    ),
    path(
        "countries/new/",
        views.country_create,
        name="countries_new",
    ),
    path(
        "countries/<int:pk>/",
        views.country_show,
        name="countries_show",
    ),
    path(
        "countries/<int:pk>/edit/",
        views.country_edit,
        name="countries_edit",
    ),
    path(
        "countries/<int:pk>/delete/",
        views.country_delete,
        name="countries_delete",
    ),
]
