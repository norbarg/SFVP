import { readDB, writeDB, type TravelRoute } from '../../utils/db';

export default defineEventHandler(async (event) => {
    const db = await readDB();

    const body = await readBody(event);

    const name = String(body.name ?? '').trim();

    const countryId = Number(body.countryId);

    const duration = Number(body.duration);

    const difficulty = String(body.difficulty ?? '');

    if (!name || !countryId || !duration || duration < 1 || !difficulty) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid route data',
        });
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

    await writeDB(db);

    setResponseStatus(event, 201);

    return newRoute;
});
