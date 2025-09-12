import Database from 'better-sqlite3';
import path from 'path';


const dbPath = path.join(process.cwd(), 'src', 'db', 'maps.db');
const db = new Database(dbPath);


// Table: events
// - id: Unique identifier for the event (integer, auto-incrementing, primary key, NOT NULL)
// - name: Name of the event (text)
// - class_id: Class ID of the event (integer)
// - map: Map associated with the event (text, can be NULL)
// - lat: Latitude of the event (real)
// - lon: Longitude of the event (real)
// - date: Date of the event (text)
// - country: Country where the event is held (text)
// - source: Source of the event (text, can be NULL)


function getMaps(country: string, limit: string, since: string, source: string) {
    
    let query = `SELECT id, lat, lon, source
                        FROM events
                        WHERE map IS NOT NULL`;
    
    
    const params: (string | number)[] = [];

    if (country) {
        query += ` AND country = ?`;
        params.push(country);
    }
    
    if (since) {
        query += ` AND date >= ?`;
        params.push(since);
    }
    
    if (source && source !== 'all') {
        query += ` AND source = ?`;
        params.push(source);
    }

    query += ` ORDER BY date DESC`;

    if (limit) {
        query += ` LIMIT ?`;
        params.push(parseInt(limit, 10));
    }
    
    const stmt = db.prepare(query);
    const all = stmt.all(...params);
    
    console.log(`Got ${all.length} events for country: ${country}, limit: ${limit}, since: ${since}, source: ${source}`);
    
    return all;
}


function getCountries() {
    const query = `SELECT DISTINCT country FROM events`;
    
    const stmt = db.prepare(query);
    const data = stmt.all() as { country: string }[];
    
    return data.map((row: { country: string }) => row.country);
}


function getEventById(id: number) {
    const query = `SELECT id, lat, lon, name, date, country, map, event_url
                        FROM events
                        WHERE id = ?`;
    const stmt = db.prepare(query);
    return stmt.get(id);
}


export { getMaps, getCountries, getEventById };

