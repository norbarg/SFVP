<?php

use App\Http\Controllers\CountryController;
use App\Http\Controllers\RouteController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/routes');

Route::resource('countries', CountryController::class);

Route::resource('routes', RouteController::class);