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

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
    const { id } = await context.params;

    const db = await readDb();

    const route = db.routes.find((item) => String(item.id) === id);

    if (!route) {
        return NextResponse.json(
            {
                message: 'Route not found',
            },
            {
                status: 404,
            },
        );
    }

    return NextResponse.json(route);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    const { id } = await context.params;

    const db = await readDb();

    const index = db.routes.findIndex((item) => String(item.id) === id);

    if (index === -1) {
        return NextResponse.json(
            {
                message: 'Route not found',
            },
            {
                status: 404,
            },
        );
    }

    const body = await request.json();

    const current = db.routes[index];

    const updated: TravelRoute = {
        ...current,

        name: body.name !== undefined ? String(body.name).trim() : current.name,

        countryId:
            body.countryId !== undefined
                ? Number(body.countryId)
                : current.countryId,

        duration:
            body.duration !== undefined
                ? Number(body.duration)
                : current.duration,

        difficulty:
            body.difficulty !== undefined
                ? String(body.difficulty)
                : current.difficulty,
    };

    if (
        !updated.name ||
        !updated.countryId ||
        !updated.duration ||
        updated.duration < 1 ||
        !updated.difficulty
    ) {
        return NextResponse.json(
            {
                message: 'Invalid route data',
            },
            {
                status: 400,
            },
        );
    }

    db.routes[index] = updated;

    await writeDb(db);

    return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
    const { id } = await context.params;

    const db = await readDb();

    const exists = db.routes.some((item) => String(item.id) === id);

    if (!exists) {
        return NextResponse.json(
            {
                message: 'Route not found',
            },
            {
                status: 404,
            },
        );
    }

    db.routes = db.routes.filter((item) => String(item.id) !== id);

    await writeDb(db);

    return NextResponse.json({
        ok: true,
    });
}
