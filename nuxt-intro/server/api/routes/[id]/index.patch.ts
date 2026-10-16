import { readDB, writeDB, type TravelRoute } from '../../../utils/db';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    const db = await readDB();

    const index = db.routes.findIndex(
        (route) => String(route.id) === String(id),
    );

    if (index === -1) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Route not found',
        });
    }

    const current = db.routes[index];

    if (!current) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Route not found',
        });
    }

    const body = await readBody(event);

    const updated: TravelRoute = {
        id: current.id,

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
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid route data',
        });
    }

    db.routes[index] = updated;

    await writeDB(db);

    return updated;
});
