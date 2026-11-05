@extends('layouts.app')

@section('title', 'ATLAS / New country')

@section('content')

<section class="page-header">

    <p class="eyebrow">
        ATLAS / NEW
    </p>

    <h1 class="page-title">
        NEW COUNTRY
    </h1>

    <p class="page-description">
        Add a new country for travel routes.
    </p>

</section>


<div class="form-page">

    <form
        method="post"
        action="{{ route('countries.store') }}"
    >
        @csrf

        @include('countries._form', [
            'country' => null,
            'buttonText' => 'Create country'
        ])

    </form>


    <div class="actions-row">

        <a
            href="{{ route('countries.index') }}"
            class="btn"
        >
            ← Back
        </a>

    </div>

</div>

@endsection