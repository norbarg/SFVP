<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    public function index()
    {
        $countries = Country::withCount('routes')
            ->orderBy('name')
            ->get();

        return view('countries.index', compact('countries'));
    }

    public function create()
    {
        return view('countries.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100',
                'unique:countries,name',
            ],
        ]);

        Country::create($validated);

        return redirect()
            ->route('countries.index')
            ->with('success', 'Country created successfully.');
    }

    public function show(Country $country)
    {
        $country->load('routes');

        return view('countries.show', compact('country'));
    }

    public function edit(Country $country)
    {
        return view('countries.edit', compact('country'));
    }

    public function update(Request $request, Country $country)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100',
                'unique:countries,name,' . $country->id,
            ],
        ]);

        $country->update($validated);

        return redirect()
            ->route('countries.index')
            ->with('success', 'Country updated successfully.');
    }

    public function destroy(Country $country)
    {
        if ($country->routes()->exists()) {
            return redirect()
                ->route('countries.index')
                ->with('error', 'Country cannot be deleted because it has routes.');
        }

        $country->delete();

        return redirect()
            ->route('countries.index')
            ->with('success', 'Country deleted successfully.');
    }
}