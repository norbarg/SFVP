import { NextRequest, NextResponse } from 'next/server';

import { readFile, writeFile } from 'fs/promises';

import path from 'path';

type TravelRoute = {
    id: string | number;
    name: string;
    countryId: string | number;
    duration: number;
    difficulty: string;
};

type Country = {
    id: string | number;
    name: string;
};

type Database = {
    routes: TravelRoute[];
    countries: Country[];
};

const dbPath = path.join(process.cwd(), 'data', 'db.json');

async function readDb(): Promise<Database> {
    const content = await readFile(dbPath, 'utf-8');

    return JSON.parse(content) as Database;
}

async function writeDb(db: Database): Promise<void> {
    await writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

export async function GET(request: NextRequest) {
    const db = await readDb();

    const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';

    let routes = db.routes;

    if (q) {
        routes = routes.filter((route) => route.name.toLowerCase().includes(q));
    }

    return NextResponse.json(routes);
}

export async function POST(request: NextRequest) {
    const db = await readDb();

    const body = await request.json();

    const name = String(body.name ?? '').trim();

    const countryId = Number(body.countryId);

    const duration = Number(body.duration);

    const difficulty = String(body.difficulty ?? '');

    if (!name || !countryId || !duration || duration < 1 || !difficulty) {
        return NextResponse.json(
            {
                message: 'Invalid route data',
            },
            {
                status: 400,
            },
        );
    }

    const numericIds = db.routes
        .map((route) => Number(route.id))
        .filter((id) => Number.isFinite(id));

    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

    const newRoute: TravelRoute = {
        id: String(nextId),

        name,

        countryId,

        duration,

        difficulty,
    };

    db.routes.push(newRoute);

    await writeDb(db);

    return NextResponse.json(newRoute, {
        status: 201,
    });
}
