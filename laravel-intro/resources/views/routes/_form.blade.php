@if ($errors->any())
    <div class="form-errors">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="form-card">

    <div>
        <label for="name">
            Route name
        </label>

        <input
            id="name"
            type="text"
            name="name"
            value="{{ old('name', $route->name ?? '') }}"
            required
        >
    </div>


    <div>
        <label for="country_id">
            Country
        </label>

        <select
            id="country_id"
            name="country_id"
            required
        >
            <option value="">
                Select country...
            </option>

            @foreach($countries as $country)
                <option
                    value="{{ $country->id }}"
                    @selected(
                        old(
                            'country_id',
                            $route->country_id ?? ''
                        ) == $country->id
                    )
                >
                    {{ $country->name }}
                </option>
            @endforeach
        </select>
    </div>


    <div>
        <label for="duration">
            Duration
        </label>

        <input
            id="duration"
            type="number"
            name="duration"
            min="1"
            value="{{ old('duration', $route->duration ?? '') }}"
            required
        >
    </div>


    <div>
        <label for="difficulty">
            Difficulty
        </label>

        <select
            id="difficulty"
            name="difficulty"
            required
        >
            <option value="">
                Select difficulty...
            </option>

            @foreach(['Easy', 'Medium', 'Hard'] as $difficulty)
                <option
                    value="{{ $difficulty }}"
                    @selected(
                        old(
                            'difficulty',
                            $route->difficulty ?? ''
                        ) === $difficulty
                    )
                >
                    {{ $difficulty }}
                </option>
            @endforeach
        </select>
    </div>


    <button
        type="submit"
        class="btn btn-dark"
    >
        {{ $buttonText }}
    </button>

</div>