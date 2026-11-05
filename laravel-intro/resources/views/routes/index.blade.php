@extends('layouts.app')

@section('title', 'ATLAS / Routes')

@section('content')

<section class="atlas-intro">

    <p
        class="atlas-kicker"
        data-i18n="kicker"
    >
        Curated travel routes
    </p>

    <h1 class="atlas-title">
        ATLAS.
    </h1>

    <p
        class="atlas-description"
        data-i18n="description"
    >
        A small collection of routes for curious travelers.
    </p>

</section>


<form
    method="get"
    action="{{ route('routes.index') }}"
    class="atlas-controls"
>

    <div class="search-box">

        <input
            type="text"
            name="q"
            value="{{ $search }}"
            placeholder="Search routes..."
            data-i18n-placeholder="search"
        >

        <button
            type="submit"
            data-i18n="find"
        >
            Search
        </button>

    </div>


    <select
        name="country"
        onchange="this.form.submit()"
    >

        <option
            value=""
            data-i18n="allCountries"
        >
            All countries
        </option>

        @foreach($countries as $country)

            <option
                value="{{ $country->id }}"
                @selected($countryId == $country->id)
            >
                {{ $country->name }}
            </option>

        @endforeach

    </select>


    <select
        name="sort"
        class="sort-button"
        onchange="this.form.submit()"
    >

        <option
            value="asc"
            @selected($sort === 'asc')
        >
            Duration ↑
        </option>

        <option
            value="desc"
            @selected($sort === 'desc')
        >
            Duration ↓
        </option>

    </select>


    <input
        type="hidden"
        name="perPage"
        value="{{ $perPage }}"
    >

</form>


@if($routes->count() === 0)

    <div class="empty-state">

        <p data-i18n="noRoutes">
            No routes found.
        </p>

    </div>

@else

    <div class="routes-grid">

        @foreach($routes as $route)

            <article class="route-card">

                <span class="route-number">
                    {{ str_pad(
                        (($routes->currentPage() - 1) * $routes->perPage())
                        + $loop->iteration,
                        2,
                        '0',
                        STR_PAD_LEFT
                    ) }}
                </span>

                <p class="route-country">
                    {{ $route->country->name }}
                </p>


                <h2>
                    {{ $route->name }}
                </h2>


                <div class="route-meta">

                    <div>

                        <span data-i18n="duration">
                            Duration
                        </span>

                        <strong>
                            {{ $route->duration }} days
                        </strong>

                    </div>


                    <div>

                        <span data-i18n="difficulty">
                            Difficulty
                        </span>

                        <strong
                            class="
                                difficulty
                                difficulty-{{ strtolower($route->difficulty) }}
                            "
                        >
                            {{ $route->difficulty }}
                        </strong>

                    </div>

                </div>


                <div class="route-actions">

                    <a
                        href="{{ route('routes.edit', $route) }}"
                    >
                        <button
                            type="button"
                            data-i18n="edit"
                        >
                            Edit
                        </button>
                    </a>


                    <form
                        method="post"
                        action="{{ route('routes.destroy', $route) }}"
                        onsubmit="
                            return confirm('Delete this route?');
                        "
                    >

                        @csrf
                        @method('DELETE')

                        <button
                            type="submit"
                            data-i18n="delete"
                        >
                            Delete
                        </button>

                    </form>

                </div>

            </article>

        @endforeach

    </div>

@endif


<div class="pagination">

    <div class="pagination-navigation">

        @if($routes->onFirstPage())

            <button
                type="button"
                disabled
                data-i18n="prev"
            >
                ← Prev
            </button>

        @else

            <a href="{{ $routes->previousPageUrl() }}">

                <button
                    type="button"
                    data-i18n="prev"
                >
                    ← Prev
                </button>

            </a>

        @endif


        <span>
            {{ str_pad($routes->currentPage(), 2, '0', STR_PAD_LEFT) }}
            /
            {{ str_pad($routes->lastPage(), 2, '0', STR_PAD_LEFT) }}
        </span>


        @if($routes->hasMorePages())

            <a href="{{ $routes->nextPageUrl() }}">

                <button
                    type="button"
                    data-i18n="next"
                >
                    Next →
                </button>

            </a>

        @else

            <button
                type="button"
                disabled
                data-i18n="next"
            >
                Next →
            </button>

        @endif

    </div>


    <form
        method="get"
        action="{{ route('routes.index') }}"
        class="per-page"
    >

        <input
            type="hidden"
            name="q"
            value="{{ $search }}"
        >

        <input
            type="hidden"
            name="country"
            value="{{ $countryId }}"
        >

        <input
            type="hidden"
            name="sort"
            value="{{ $sort }}"
        >


        <span data-i18n="show">
            Show
        </span>


        <select
            name="perPage"
            onchange="this.form.submit()"
        >

            @foreach([5, 10, 20] as $n)

                <option
                    value="{{ $n }}"
                    @selected($perPage === $n)
                >
                    {{ $n }}
                </option>

            @endforeach

        </select>

    </form>

</div>

@endsection