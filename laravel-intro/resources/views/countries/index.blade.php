@extends('layouts.app')

@section('title', 'ATLAS / Countries')

@section('content')

<section class="page-header">

    <p class="eyebrow">
        ATLAS / COUNTRIES
    </p>

    <h1 class="page-title">
        COUNTRIES
    </h1>

    <p class="page-description">
        Manage countries used by the ATLAS travel routes.
    </p>

</section>


<div class="toolbar">

    <a
        href="{{ route('countries.create') }}"
        class="btn btn-dark"
    >
        + New country
    </a>

    <a
        href="{{ route('routes.index') }}"
        class="btn"
    >
        Routes
    </a>

</div>


@if(session('success'))

    <div class="flash flash-success">
        {{ session('success') }}
    </div>

@endif


@if(session('error'))

    <div class="flash flash-error">
        {{ session('error') }}
    </div>

@endif


<table class="atlas-table">

    <thead>

        <tr>
            <th>#</th>
            <th>Country</th>
            <th>Routes</th>
            <th>Actions</th>
        </tr>

    </thead>


    <tbody>

    @forelse($countries as $country)

        <tr>

            <td>
                {{ $country->id }}
            </td>

            <td>
                <strong>
                    {{ $country->name }}
                </strong>
            </td>

            <td>
                {{ $country->routes_count }}
            </td>

            <td>

                <div class="table-actions">

                    <a
                        href="{{ route('countries.show', $country) }}"
                        class="btn"
                    >
                        View
                    </a>

                    <a
                        href="{{ route('countries.edit', $country) }}"
                        class="btn"
                    >
                        Edit
                    </a>

                </div>

            </td>

        </tr>

    @empty

        <tr>
            <td colspan="4">
                No countries found.
            </td>
        </tr>

    @endforelse

    </tbody>

</table>

@endsection