<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Route;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('q', ''));
        $countryId = $request->query('country');
        $sort = $request->query('sort', 'asc');

        $allowedPerPage = [5, 10, 20];

        $perPage = (int) $request->query('perPage', 5);

        if (!in_array($perPage, $allowedPerPage, true)) {
            $perPage = 5;
        }

        $query = Route::query()
            ->with('country');

        if ($search !== '') {
            $query->where('name', 'like', '%' . $search . '%');
        }

        if (!empty($countryId)) {
            $query->where('country_id', (int) $countryId);
        }

        $direction = $sort === 'desc'
            ? 'desc'
            : 'asc';

        $routes = $query
            ->orderBy('duration', $direction)
            ->paginate($perPage)
            ->withQueryString();

        $countries = Country::orderBy('name')->get();

        return view('routes.index', compact(
            'routes',
            'countries',
            'search',
            'countryId',
            'sort',
            'perPage'
        ));
    }

    public function create()
    {
        $countries = Country::orderBy('name')->get();

        return view('routes.create', compact('countries'));
    }

    public function store(Request $request)
    {
        $validated = $this->validateRoute($request);

        Route::create($validated);

        return redirect()
            ->route('routes.index')
            ->with('success', 'Route created successfully.');
    }

    public function show(Route $route)
    {
        $route->load('country');

        return view('routes.show', compact('route'));
    }

    public function edit(Route $route)
    {
        $countries = Country::orderBy('name')->get();

        return view('routes.edit', compact(
            'route',
            'countries'
        ));
    }

    public function update(Request $request, Route $route)
    {
        $validated = $this->validateRoute($request);

        $route->update($validated);

        return redirect()
            ->route('routes.index')
            ->with('success', 'Route updated successfully.');
    }

    public function destroy(Route $route)
    {
        $route->delete();

        return redirect()
            ->route('routes.index')
            ->with('success', 'Route deleted successfully.');
    }

    private function validateRoute(Request $request): array
    {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'min:2',
                'max:150',
            ],

            'duration' => [
                'required',
                'integer',
                'min:1',
            ],

            'difficulty' => [
                'required',
                'in:Easy,Medium,Hard',
            ],

            'country_id' => [
                'required',
                'integer',
                'exists:countries,id',
            ],
        ]);
    }
}