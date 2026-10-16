import { readDB, writeDB } from '../../../utils/db';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    const db = await readDB();

    const exists = db.routes.some((route) => String(route.id) === String(id));

    if (!exists) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Route not found',
        });
    }

    db.routes = db.routes.filter((route) => String(route.id) !== String(id));

    await writeDB(db);

    return {
        ok: true,
    };
});
