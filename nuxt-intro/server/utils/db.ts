import { readFile, writeFile } from 'node:fs/promises';

import path from 'node:path';

export type TravelRoute = {
    id: string | number;
    name: string;
    countryId: string | number;
    duration: number;
    difficulty: string;
};

export type Country = {
    id: string | number;
    name: string;
};

export type Database = {
    routes: TravelRoute[];
    countries: Country[];
};

const dbPath = path.resolve('server/db.json');

export async function readDB(): Promise<Database> {
    const raw = await readFile(dbPath, 'utf-8');

    return JSON.parse(raw) as Database;
}

export async function writeDB(data: Database): Promise<void> {
    await writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}
