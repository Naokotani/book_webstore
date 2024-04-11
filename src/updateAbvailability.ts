import { Database } from "bun:sqlite";
import type { AdminForm } from "./types";

export default function updateAvailability(db: Database, body: AdminForm[]) {
  body.forEach((select) => {
    try {
      db.query(
        `
UPDATE books
SET available=$available
WHERE id=$id;`,
      ).run({
        $available: select.value,
        $id: select.id,
      });
    } catch (e) {
      console.log("Error updating availability", e);
      return false;
    }
  });
  return true;
}
