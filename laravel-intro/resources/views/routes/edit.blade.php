@extends('layouts.app')

@section('title', 'ATLAS / Edit route')

@section('content')

<section class="page-header">

    <p class="eyebrow">
        ATLAS / EDIT
    </p>

    <h1 class="page-title">
        EDIT ROUTE
    </h1>

    <p class="page-description">
        Update the selected travel route.
    </p>

</section>


<div class="form-page">

    <form
        method="post"
        action="{{ route('routes.update', $route) }}"
    >
        @csrf
        @method('PUT')

        @include('routes._form', [
            'route' => $route,
            'buttonText' => 'Save changes'
        ])
    </form>


    <div class="actions-row">

        <a
            href="{{ route('routes.index') }}"
            class="btn"
        >
            ← Back
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

</div>

@endsection