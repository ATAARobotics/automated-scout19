const fs = require("fs");
const DB_USERNAME = fs.readFileSync('DB_USERNAME', "utf8");
const DB_PASSWORD = fs.readFileSync('DB_PASSWORD', "utf8");
const DB_ADDRESS = fs.readFileSync('DB_ADDRESS', "utf8");
const nano = require("nano")(`http://${DB_USERNAME}:${DB_PASSWORD}@${DB_ADDRESS}:5984`);

module.exports = {
    exists: async (dbName) => {
        const db = await nano.db.use(dbName);
        try {
            let dbInfo = await db.info();
            return true;
        } catch (err) {
            console.log(err);
            if (err.code == "ECONNREFUSED" || err.code == "ENETUNREACH") {
                throw "ERROR: Could not connect to database"
            } else if (err.error == "not_found") {
                return false
            } else {
                throw "ERROR: Could not connect to database"
            }
        }
    }
}