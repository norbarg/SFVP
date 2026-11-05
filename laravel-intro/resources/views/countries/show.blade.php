@extends('layouts.app')

@section('title', 'ATLAS / Country')

@section('content')

<section class="page-header">

    <p class="eyebrow">
        ATLAS / COUNTRY
    </p>

    <h1 class="page-title">
        {{ $country->name }}
    </h1>

    <p class="page-description">
        Country details and related travel routes.
    </p>

</section>


<div class="detail-card">

    <div class="detail-row">

        <div class="detail-label">
            ID
        </div>

        <div class="detail-value">
            {{ $country->id }}
        </div>

    </div>


    <div class="detail-row">

        <div class="detail-label">
            Country
        </div>

        <div class="detail-value">
            {{ $country->name }}
        </div>

    </div>


    <div class="detail-row">

        <div class="detail-label">
            Routes
        </div>

        <div class="detail-value">
            {{ $country->routes->count() }}
        </div>

    </div>

</div>


@if($country->routes->count() > 0)

    <div class="country-routes">

        <h2>
            Routes
        </h2>

        @foreach($country->routes as $route)

            <a
                href="{{ route('routes.show', $route) }}"
                class="country-route-item"
            >
                <span>
                    {{ $route->name }}
                </span>

                <small>
                    {{ $route->duration }} days
                </small>
            </a>

        @endforeach

    </div>

@endif


<div class="actions-row">

    <a
        href="{{ route('countries.index') }}"
        class="btn"
    >
        ← Back
    </a>

    <a
        href="{{ route('countries.edit', $country) }}"
        class="btn btn-dark"
    >
        Edit
    </a>

    <form
        method="post"
        action="{{ route('countries.destroy', $country) }}"
        onsubmit="return confirm('Delete this country?');"
    >

        @csrf
        @method('DELETE')

        <button
            type="submit"
            class="btn btn-danger"
        >
            Delete
        </button>

    </form>

</div>

@endsection