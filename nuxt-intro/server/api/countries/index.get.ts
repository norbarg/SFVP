import { readDB } from '../../utils/db';

export default defineEventHandler(async () => {
    const db = await readDB();

    return db.countries;
});
