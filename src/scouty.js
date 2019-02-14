const fs = require("fs");
const DB_USERNAME = fs.readFileSync('DB_USERNAME', "utf8");
const DB_PASSWORD = fs.readFileSync('DB_PASSWORD', "utf8");
const DB_ADDRESS = fs.readFileSync('DB_ADDRESS', "utf8");
const nano = require("nano")(`http://${DB_USERNAME}:${DB_PASSWORD}@${DB_ADDRESS}:5984`);
const moment = require("moment");

function getAverageDropoffTime(times) {
    var sum = 0;
    for (var i = 0; i<times.length; i++) {
        var momentTimeStart = moment(times[i][0], "mm:ss.S");
        var momentTimeEnd = moment(times[i][1], "mm:ss.S");
        sum += momentTimeStart.diff(momentTimeEnd);
    }
    sum /= times.length;
    return moment(sum).format("ss.S");
}

function getAveragePickupTime(times) {
    var sum = 0;
    for (var i = 0; i<times.length; i++) {
        if (i+1<times.length) {
            var momentTimeStart = moment(times[i][1], "mm:ss.S");
            var momentTimeEnd = moment(times[i+1][0], "mm:ss.S");
            sum += momentTimeStart.diff(momentTimeEnd);
        }
    }
    sum /= (times.length - 1);
    return moment(sum).format("ss.S");
}

function getPointsEarned(full) {
    var totalPoints = 0;
    totalPoints += (full.sandstormCargoCargoship + full.sandstormCargoRocket + full.teleopCargoshipCargo + full.teleopRocket1Cargo + full.teleopRocket2Cargo + full.teleopRocket3Cargo) * 3;
    totalPoints += (full.sandstormHatchCargoship + full.sandstormHatchRocket + full.teleopCargoshipHatch + full.teleopRocket1Hatch + full.teleopRocket2Hatch + full.teleopRocket3Hatch) * 2;
    if (full.crossedBaseline == 1 && full.startingLevel == 1) {
        totalPoints += 3;
    }
    if (full.crossedBaseline == 1 && full.startingLevel == 2) {
        totalPoints += 6;
    }
    if (full.climbingType == "1") {
        totalPoints += 3;
    }
    if (full.climbingType == "2") {
        totalPoints += 6;
    }
    if (full.climbingType == "3" || full.climbingTime == "2-3") {
        totalPoints += 12;
    }
    return totalPoints;
}

function addData(orig) {
    orig.averageCargoPickupTime = getAveragePickupTime(orig.teleopCargoTime);
    orig.averageCargoDropoffTime = getAverageDropoffTime(orig.teleopCargoTime);
    orig.averageHatchPickupTime = getAveragePickupTime(orig.teleopHatchTime);
    orig.averageHatchDropoffTime = getAverageDropoffTime(orig.teleopHatchTime);
    orig.climbingDuration = moment(moment(orig.climbingTime[0], "mm:ss.S").diff(moment(orig.climbingTime[1], "mm:ss.S"))).format("ss.S");
    orig.cargoSuccessPercent = +(((orig.teleopCargoshipCargo + orig.teleopRocket1Cargo + orig.teleopRocket2Cargo + orig.teleopRocket3Cargo) / (orig.teleopCargoshipCargo + orig.teleopRocket1Cargo + orig.teleopRocket2Cargo + orig.teleopRocket3Cargo + orig.teleopDroppedCargo) * 100).toFixed(1));
    orig.hatchSuccessPercent = +(((orig.teleopCargoshipHatch + orig.teleopRocket1Hatch + orig.teleopRocket2Hatch + orig.teleopRocket3Hatch) / (orig.teleopCargoshipHatch + orig.teleopRocket1Hatch + orig.teleopRocket2Hatch + orig.teleopRocket3Hatch + orig.teleopDroppedHatch) * 100).toFixed(1));
    orig.pointsEarned = getPointsEarned(orig);
    return orig;
}

async function getTeamMatch (dbName, teamNumber, matchType, matchNumber) {
    try {
        const db = await nano.db.use(dbName);
        let teamMatch = await db.get(`${matchType}${matchNumber}_${teamNumber}`);
        return addData(teamMatch);
    } catch (err) {
        return err;
    }
}

async function getAllTeamMatches (dbName, teamNumber, matchType) {
    try {
        const db = await nano.db.use(dbName);
        if (!matchType) {
            let data = await db.find({"selector": {"_id": {"$regex": `^[q,p][0-9]*_${teamNumber}*$`}}});
            return addData(data);
        } else if (matchType == "p") {
            let data = await db.find({"selector": {"_id": {"$regex": `^p[0-9]*_${teamNumber}*$`}}});
            return addData(data);
        } else if (matchType == "q") {
            let data = await db.find({"selector": {"_id": {"$regex": `^q[0-9]*_${teamNumber}*$`}}});
            return addData(data);
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