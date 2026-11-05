@extends('layouts.app')

@section('title', 'ATLAS / New route')

@section('content')

<section class="page-header">

    <p class="eyebrow">
        ATLAS / NEW
    </p>

    <h1 class="page-title">
        NEW ROUTE
    </h1>

    <p class="page-description">
        Add a new travel route to the ATLAS collection.
    </p>

</section>


<div class="form-page">

    <form
        method="post"
        action="{{ route('routes.store') }}"
    >
        @csrf

        @include('routes._form', [
            'route' => null,
            'buttonText' => 'Create route'
        ])
    </form>


    <div class="actions-row">

        <a
            href="{{ route('routes.index') }}"
            class="btn"
        >
            ← Back
        </a>

    </div>

</div>

@endsection