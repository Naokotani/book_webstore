import { Database } from 'bun:sqlite'

export default function checkAvailability(db: Database, id: number) {
    return true;
}
