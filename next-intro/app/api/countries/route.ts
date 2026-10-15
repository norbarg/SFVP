import { NextResponse } from 'next/server';

import { readFile } from 'fs/promises';

import path from 'path';

type Country = {
    id: number;
    name: string;
};

type Database = {
    countries: Country[];
};

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export async function GET() {
    const content = await readFile(dbPath, 'utf-8');

    const db = JSON.parse(content) as Database;

    return NextResponse.json(db.countries);
}
