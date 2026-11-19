from django.contrib import messages
from django.core.paginator import EmptyPage, Paginator
from django.db.models import ProtectedError
from django.shortcuts import (
    get_object_or_404,
    redirect,
    render,
)

from .forms import CountryForm, RouteForm
from .models import Country, Route


def route_list(request):
    search = (request.GET.get("q") or "").strip()
    country_id_raw = request.GET.get("country") or ""
    sort = request.GET.get("sort", "asc")
    page_raw = request.GET.get("page", "1")
    per_page_raw = request.GET.get("perPage", "5")

    try:
        country_id = int(country_id_raw) if country_id_raw else None
    except ValueError:
        country_id = None

    try:
        page = max(1, int(page_raw))
    except ValueError:
        page = 1

    try:
        per_page = int(per_page_raw)
    except ValueError:
        per_page = 5

    if per_page not in [5, 10, 20]:
        per_page = 5

    routes = Route.objects.select_related("country")

    if search:
        routes = routes.filter(name__icontains=search)

    if country_id:
        routes = routes.filter(country_id=country_id)

    if sort == "desc":
        routes = routes.order_by("-duration", "name")
    else:
        sort = "asc"
        routes = routes.order_by("duration", "name")

    total = routes.count()

    paginator = Paginator(
        routes,
        per_page,
    )

    try:
        page_obj = paginator.page(page)
    except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)

    return render(
        request,
        "routes/index.html",
        {
            "routes": page_obj.object_list,
            "countries": Country.objects.all(),
            "search": search,
            "countryId": country_id,
            "sort": sort,
            "page": page_obj.number,
            "perPage": per_page,
            "total": total,
            "totalPages": paginator.num_pages,
            "hasPrevious": page_obj.has_previous(),
            "hasNext": page_obj.has_next(),
            "previousPage": (
                page_obj.previous_page_number() if page_obj.has_previous() else None
            ),
            "nextPage": (page_obj.next_page_number() if page_obj.has_next() else None),
        },
    )


def route_create(request):
    if request.method == "POST":
        form = RouteForm(request.POST)

        if form.is_valid():
            form.save()

            messages.success(
                request,
                "Route created successfully.",
            )

            return redirect("routes_index")
    else:
        form = RouteForm()

    return render(
        request,
        "routes/form.html",
        {
            "form": form,
            "isEdit": False,
        },
    )


def route_show(request, pk):
    route = get_object_or_404(
        Route.objects.select_related("country"),
        pk=pk,
    )

    return render(
        request,
        "routes/show.html",
        {
            "route": route,
        },
    )


def route_edit(request, pk):
    route = get_object_or_404(
        Route,
        pk=pk,
    )

    if request.method == "POST":
        form = RouteForm(
            request.POST,
            instance=route,
        )

        if form.is_valid():
            form.save()

            messages.success(
                request,
                "Route updated successfully.",
            )

            return redirect("routes_index")
    else:
        form = RouteForm(
            instance=route,
        )

    return render(
        request,
        "routes/form.html",
        {
            "form": form,
            "route": route,
            "isEdit": True,
        },
    )


def route_delete(request, pk):
    if request.method == "POST":
        route = get_object_or_404(
            Route,
            pk=pk,
        )

        route.delete()

        messages.success(
            request,
            "Route deleted successfully.",
        )

    return redirect("routes_index")


def country_list(request):
    countries = Country.objects.all()

    return render(
        request,
        "countries/index.html",
        {
            "countries": countries,
        },
    )


def country_create(request):
    if request.method == "POST":
        form = CountryForm(request.POST)

        if form.is_valid():
            form.save()

            messages.success(
                request,
                "Country created successfully.",
            )

            return redirect("countries_index")
    else:
        form = CountryForm()

    return render(
        request,
        "countries/form.html",
        {
            "form": form,
            "isEdit": False,
        },
    )


def country_show(request, pk):
    country = get_object_or_404(
        Country,
        pk=pk,
    )

    return render(
        request,
        "countries/show.html",
        {
            "country": country,
            "routes": country.routes.all(),
        },
    )


def country_edit(request, pk):
    country = get_object_or_404(
        Country,
        pk=pk,
    )

    if request.method == "POST":
        form = CountryForm(
            request.POST,
            instance=country,
        )

        if form.is_valid():
            form.save()

            messages.success(
                request,
                "Country updated successfully.",
            )

            return redirect("countries_index")
    else:
        form = CountryForm(
            instance=country,
        )

    return render(
        request,
        "countries/form.html",
        {
            "form": form,
            "country": country,
            "isEdit": True,
        },
    )


def country_delete(request, pk):
    if request.method == "POST":
        country = get_object_or_404(
            Country,
            pk=pk,
        )

        try:
            country.delete()

            messages.success(
                request,
                "Country deleted successfully.",
            )
        except ProtectedError:
            messages.error(
                request,
                "Country cannot be deleted because it has routes.",
            )

    return redirect("countries_index")
