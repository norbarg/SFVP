@extends('layouts.app')

@section('title', 'ATLAS / Edit country')

@section('content')

<section class="page-header">

    <p class="eyebrow">
        ATLAS / EDIT
    </p>

    <h1 class="page-title">
        EDIT COUNTRY
    </h1>

    <p class="page-description">
        Update the selected country.
    </p>

</section>


<div class="form-page">

    <form
        method="post"
        action="{{ route('countries.update', $country) }}"
    >
        @csrf
        @method('PUT')

        @include('countries._form', [
            'country' => $country,
            'buttonText' => 'Save changes'
        ])

    </form>


    <div class="actions-row">

        <a
            href="{{ route('countries.index') }}"
            class="btn"
        >
            ← Back
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

</div>

@endsection