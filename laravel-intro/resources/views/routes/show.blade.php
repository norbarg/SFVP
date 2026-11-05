@extends('layouts.app')

@section('title', 'ATLAS / Route')

@section('content')

<section class="page-header">

    <p class="eyebrow">
        ATLAS / ROUTE
    </p>

    <h1 class="page-title">
        {{ $route->name }}
    </h1>

    <p class="page-description">
        Detailed information about the selected travel route.
    </p>

</section>


<div class="detail-card">

    <div class="detail-row">

        <div class="detail-label">
            ID
        </div>

        <div class="detail-value">
            {{ $route->id }}
        </div>

    </div>


    <div class="detail-row">

        <div class="detail-label">
            Country
        </div>

        <div class="detail-value">
            {{ $route->country->name }}
        </div>

    </div>


    <div class="detail-row">

        <div class="detail-label">
            Duration
        </div>

        <div class="detail-value">
            {{ $route->duration }} days
        </div>

    </div>


    <div class="detail-row">

        <div class="detail-label">
            Difficulty
        </div>

        <div class="detail-value">

            <span
                class="
                    difficulty
                    difficulty-{{ strtolower($route->difficulty) }}
                "
            >
                {{ $route->difficulty }}
            </span>

        </div>

    </div>

</div>


<div class="actions-row">

    <a
        href="{{ route('routes.index') }}"
        class="btn"
    >
        ← Back
    </a>

    <a
        href="{{ route('routes.edit', $route) }}"
        class="btn btn-dark"
    >
        Edit
    </a>

    <form
        method="post"
        action="{{ route('routes.destroy', $route) }}"
        onsubmit="return confirm('Delete this route?');"
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