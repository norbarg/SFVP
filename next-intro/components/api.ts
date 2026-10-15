import axios from 'axios';

export type TravelRoute = {
    id?: number;
    name: string;
    countryId: number;
    duration: number;
    difficulty: string;
};

export type Country = {
    id: number;
    name: string;
};

export const RoutesApi = {
    async list(params?: { q?: string }): Promise<TravelRoute[]> {
        const response = await axios.get<TravelRoute[]>('/api/routes', {
            params,
        });

        return response.data;
    },

    async get(id: string | number): Promise<TravelRoute> {
        const response = await axios.get<TravelRoute>(`/api/routes/${id}`);

        return response.data;
    },

    async create(payload: Omit<TravelRoute, 'id'>): Promise<TravelRoute> {
        const response = await axios.post<TravelRoute>('/api/routes', payload);

        return response.data;
    },

    async update(
        id: string | number,
        payload: Partial<TravelRoute>,
    ): Promise<TravelRoute> {
        const response = await axios.patch<TravelRoute>(
            `/api/routes/${id}`,
            payload,
        );

        return response.data;
    },

    async remove(id: string | number): Promise<void> {
        await axios.delete(`/api/routes/${id}`);
    },
};

export const CountriesApi = {
    async list(): Promise<Country[]> {
        const response = await axios.get<Country[]>('/api/countries');

        return response.data;
    },
};
