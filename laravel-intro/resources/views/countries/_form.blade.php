@if ($errors->any())

    <div class="form-errors">

        <ul>
            @foreach ($errors->all() as $error)
                <li>
                    {{ $error }}
                </li>
            @endforeach
        </ul>

    </div>

@endif


<div class="form-card">

    <div>

        <label for="name">
            Country name
        </label>

        <input
            id="name"
            type="text"
            name="name"
            value="{{ old('name', $country->name ?? '') }}"
            required
        >

    </div>


    <button
        type="submit"
        class="btn btn-dark"
    >
        {{ $buttonText }}
    </button>

</div>