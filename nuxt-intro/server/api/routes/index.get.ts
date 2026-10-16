import { readDB } from '../../utils/db';

export default defineEventHandler(async (event) => {
    const db = await readDB();

    const query = getQuery(event);

    const q = String(query.q ?? '')
        .trim()
        .toLowerCase();

    let routes = db.routes;

    if (q) {
        routes = routes.filter((route) => route.name.toLowerCase().includes(q));
    }

    return routes;
});
