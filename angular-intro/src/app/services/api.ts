import { inject, Injectable } from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

import {
    Observable,
} from 'rxjs';

export interface TravelRoute {
    id?: string | number;
    name: string;
    countryId: number;
    duration: number;
    difficulty: string;
}

export interface Country {
    id: string | number;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly http =
        inject(HttpClient);

    private readonly baseUrl =
        'http://localhost:5174';

    getRoutes(): Observable<TravelRoute[]> {
        return this.http.get<TravelRoute[]>(
            `${this.baseUrl}/routes`,
        );
    }

    getRoute(
        id: string | number,
    ): Observable<TravelRoute> {
        return this.http.get<TravelRoute>(
            `${this.baseUrl}/routes/${id}`,
        );
    }

    createRoute(
        route: Omit<TravelRoute, 'id'>,
    ): Observable<TravelRoute> {
        return this.http.post<TravelRoute>(
            `${this.baseUrl}/routes`,
            route,
        );
    }

    updateRoute(
        id: string | number,
        route: Partial<TravelRoute>,
    ): Observable<TravelRoute> {
        return this.http.patch<TravelRoute>(
            `${this.baseUrl}/routes/${id}`,
            route,
        );
    }

    deleteRoute(
        id: string | number,
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/routes/${id}`,
        );
    }

    getCountries(): Observable<Country[]> {
        return this.http.get<Country[]>(
            `${this.baseUrl}/countries`,
        );
    }
}