const fs = require("fs");
const DB_USERNAME = fs.readFileSync('DB_USERNAME', "utf8");
const DB_PASSWORD = fs.readFileSync('DB_PASSWORD', "utf8");
const DB_ADDRESS = fs.readFileSync('DB_ADDRESS', "utf8");
const nano = require("nano")(`http://${DB_USERNAME}:${DB_PASSWORD}@${DB_ADDRESS}:5984`);

async function getTeamMatch (dbName, teamNumber, matchType, matchNumber) {
    try {
        const db = await nano.db.use(dbName);
        return await db.get(`${matchType}${matchNumber}_${teamNumber}`)
    } catch (err) {
        return err;
    }
}

async function getAllTeamMatches (dbName, teamNumber, matchType) {
    try {
        const db = await nano.db.use(dbName);
        if (!matchType) {
            return await db.find({"selector": {"_id": {"$regex": `^[q,p][0-9]*_${teamNumber}*$`}}});
        } else if (matchType == "p") {
            return await db.find({"selector": {"_id": {"$regex": `^p[0-9]*_${teamNumber}*$`}}});
        } else if (matchType == "q") {
            return await db.find({"selector": {"_id": {"$regex": `^q[0-9]*_${teamNumber}*$`}}});
        } else {
            return "Invalid match type"
        }
    } catch (err) {
        return err;
    }
}

async function getTeamPit (dbName, teamNumber) {
    try {
        const db = await nano.db.use(dbName);
        let revs = await db.get(`pit_${teamNumber}`, {revs_info: true});
        var allRevs = [];
        for (var i = 0; i<revs._revs_info.length; i++) {
            allRevs.push(await db.get(`pit_${teamNumber}`, {rev: revs._revs_info[i].rev, attachments: true}))
        }
        return allRevs;
    } catch (err) {
        return err;
    }
}

module.exports = {
    getTeamMatch,
    getAllTeamMatches,
    getTeamPit
}