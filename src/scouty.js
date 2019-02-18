const fs = require("fs");
const DB_USERNAME = fs.readFileSync('DB_USERNAME', "utf8");
const DB_PASSWORD = fs.readFileSync('DB_PASSWORD', "utf8");
const DB_ADDRESS = fs.readFileSync('DB_ADDRESS', "utf8");
const nano = require("nano")(`http://${DB_USERNAME}:${DB_PASSWORD}@${DB_ADDRESS}:5984`);
const moment = require("moment");

function getAverageDropoffTime(times) {
    var sum = 0;
    if (times.length > 1) {
        for (var i = 0; i<times.length; i++) {
            var momentTimeStart = moment(times[i][0], "mm:ss.S");
            var momentTimeEnd = moment(times[i][1], "mm:ss.S");
            sum += momentTimeStart.diff(momentTimeEnd);
        }
    } else {
        return "02:30.00"
    }
    sum /= times.length;
    return moment(sum).format("mm:ss.S");
}

function getAveragePickupTime(times) {
    var sum = 0;
    if (times.length > 1) {
        for (var i = 0; i<times.length; i++) {
            if (i+1<times.length) {
                var momentTimeStart = moment(times[i][1], "mm:ss.S");
                var momentTimeEnd = moment(times[i+1][0], "mm:ss.S");
                sum += momentTimeStart.diff(momentTimeEnd);
            }
        }
    } else {
        return "02:30.00"
    }
    sum /= (times.length - 1);
    return moment(sum).format("mm:ss.S");
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
    orig.totalHatch = orig.sandstormHatchCargoship + orig.sandstormHatchRocket + orig.teleopCargoshipHatch + orig.teleopRocket1Hatch + orig.teleopRocket2Hatch + orig.teleopRocket3Hatch;
    orig.totalCargo = orig.sandstormCargoCargoship + orig.sandstormCargoRocket + orig.teleopCargoshipCargo + orig.teleopRocket1Cargo + orig.teleopRocket2Cargo + orig.teleopRocket3Cargo;
    orig.averageCargoPickupTime = getAveragePickupTime(orig.teleopCargoTime);
    orig.averageCargoDropoffTime = getAverageDropoffTime(orig.teleopCargoTime);
    orig.averageHatchPickupTime = getAveragePickupTime(orig.teleopHatchTime);
    orig.averageHatchDropoffTime = getAverageDropoffTime(orig.teleopHatchTime);
    orig.climbingDuration = (orig.climbingTime.length != 0 ? moment(moment(orig.climbingTime[0], "mm:ss.S").diff(moment(orig.climbingTime[1], "mm:ss.S"))).format("mm:ss.S") : "02:30.00");
    orig.cargoSuccessPercent = +(((orig.teleopCargoshipCargo + orig.teleopRocket1Cargo + orig.teleopRocket2Cargo + orig.teleopRocket3Cargo) / (orig.teleopCargoshipCargo + orig.teleopRocket1Cargo + orig.teleopRocket2Cargo + orig.teleopRocket3Cargo + orig.teleopDroppedCargo) * 100).toFixed(1)) || 0;
    orig.hatchSuccessPercent = +(((orig.teleopCargoshipHatch + orig.teleopRocket1Hatch + orig.teleopRocket2Hatch + orig.teleopRocket3Hatch) / (orig.teleopCargoshipHatch + orig.teleopRocket1Hatch + orig.teleopRocket2Hatch + orig.teleopRocket3Hatch + orig.teleopDroppedHatch) * 100).toFixed(1)) || 0;
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
            var calculated = [];
            let data = await db.find({"selector": {"_id": {"$regex": `^[q,p][0-9]*_${teamNumber}*$`}}});
            for (var i = 0; i < data.docs.length; i++) {
                calculated.push(addData(data.docs[i]));
            }
            return calculated;
        } else if (matchType == "p") {
            var calculated = [];
            let data = await db.find({"selector": {"_id": {"$regex": `^p[0-9]*_${teamNumber}*$`}}});
            for (var i = 0; i < data.docs.length; i++) {
                calculated.push(addData(data.docs[i]));
            }
            return calculated;
        } else if (matchType == "q") {
            var calculated = [];
            let data = await db.find({"selector": {"_id": {"$regex": `^q[0-9]*_${teamNumber}*$`}}});
            for (var i = 0; i < data.docs.length; i++) {
                calculated.push(addData(data.docs[i]));
            }
            return calculated;
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

function mode(array) {
    let mf = 1;
    let m = 0;
    let item;
    for (let i = 0; i < array.length; i++) {
        for (let j = i; j < array.length; j++) {
            if (array[i] == array[j])
                m++;
            if (mf < m) {
                mf = m;
                item = array[i];
            }
        }
        m = 0;
    }
    var result = `${item}`;
    return result;
}

async function getTeamAverage (dbName, teamNumber, matchType) {
    try {
        let matches = await getAllTeamMatches(dbName, teamNumber, matchType);
        var startingLevel = [];
        var crossedBaseline = 0;
        var sandstormCargoCargoship = 0;
        var sandstormCargoRocket = 0;
        var sandstormHatchCargoship = 0;
        var sandstormHatchRocket = 0;
        var teleopCargoshipCargo = 0;
        var teleopRocket1Cargo = 0;
        var teleopRocket2Cargo = 0;
        var teleopRocket3Cargo = 0;
        var teleopDroppedCargo = 0;
        var cargoPickupTime = moment.duration(0);
        var cargoDropoffTime = moment.duration(0);
        var cargoSuccessPercent = 0;
        var totalCargo = 0;
        var teleopCargoshipHatch = 0;
        var teleopRocket1Hatch = 0;
        var teleopRocket2Hatch = 0;
        var teleopRocket3Hatch = 0;
        var teleopDroppedHatch = 0;
        var hatchPickupTime = moment.duration(0);
        var hatchDropoffTime = moment.duration(0);
        var hatchSuccessPercent = 0;
        var totalHatch = 0;
        var climbingDuration = moment.duration(0);
        var pointsEarned = 0;
        var climbingType = [];
        var climbingGaveAssistance = 0;
        var climbingGotAssistance = 0;
        var speed = 0;
        var stability = 0;
        var driverSkill = 0;
        var defence = 0;
        var anythingBreak = 0;
        var dead = 0;
        for (i = 0; i < matches.length; i++) {
            startingLevel.push(matches[i].startingLevel);
            crossedBaseline += matches[i].crossesBaseline;
            sandstormCargoCargoship += matches[i].sandstormCargoCargoship;
            sandstormCargoRocket += matches[i].sandstormCargoRocket;
            sandstormHatchCargoship += matches[i].sandstormHatchCargoship;
            sandstormHatchRocket += matches[i].sandstormHatchRocket;
            teleopCargoshipCargo += matches[i].teleopCargoshipCargo;
            teleopRocket1Cargo += matches[i].teleopRocket1Cargo;
            teleopRocket2Cargo += matches[i].teleopRocket2Cargo;
            teleopRocket3Cargo += matches[i].teleopRocket3Cargo;
            teleopDroppedCargo += matches[i].teleopDroppedCargo;
            cargoPickupTime = cargoPickupTime.add(moment.duration(`00:${matches[i].averageCargoPickupTime}`));
            cargoDropoffTime = cargoDropoffTime.add(moment.duration(`00:${matches[i].averageCargoDropoffTime}`));
            cargoSuccessPercent += matches[i].cargoSuccessPercent || 0;
            totalCargo += matches[i].totalCargo;
            teleopCargoshipHatch += matches[i].teleopCargoshipHatch;
            teleopRocket1Hatch += matches[i].teleopRocket1Hatch;
            teleopRocket2Hatch += matches[i].teleopRocket2Hatch;
            teleopRocket3Hatch += matches[i].teleopRocket3Hatch;
            teleopDroppedHatch += matches[i].teleopDroppedHatch;
            hatchPickupTime = hatchPickupTime.add(moment.duration(`00:${matches[i].averageHatchPickupTime}`));
            hatchDropoffTime = hatchDropoffTime.add(moment.duration(`00:${matches[i].averageHatchDropoffTime}`));
            hatchSuccessPercent += matches[i].hatchSuccessPercent || 0;
            totalHatch += matches[i].totalHatch;
            climbingDuration = climbingDuration.add(moment.duration(`00:${matches[i].climbingDuration}`));
            pointsEarned += matches[i].pointsEarned;
            climbingType.push(matches[i].climbingType);
            climbingGaveAssistance += matches[i].climbingGaveAssistance;
            climbingGotAssistance += matches[i].climbingGotAssistance;
            speed += matches[i].speed;
            stability += matches[i].stability;
            driverSkill += matches[i].driverSkill;
            defence += matches[i].defence;
            anythingBreak += matches[i].anythingBreak;
            dead += matches[i].dead;
        }
        return {
            startingLevel: mode(startingLevel),
            crossedBaseline: +((crossedBaseline / matches.length) * 100).toFixed(1),
            sandstormCargoCargoship: +((sandstormCargoCargoship / matches.length) * 100).toFixed(1),
            sandstormCargoRocket: +((sandstormCargoRocket / matches.length) * 100).toFixed(1),
            sandstormHatchCargoship: +((sandstormHatchCargoship / matches.length) * 100).toFixed(1),
            sandstormHatchRocket: +((sandstormHatchRocket / matches.length) * 100).toFixed(1),
            teleopCargoshipCargo: +(teleopCargoshipCargo / matches.length).toFixed(1),
            teleopRocket1Cargo: +(teleopRocket1Cargo / matches.length).toFixed(1),
            teleopRocket2Cargo: +(teleopRocket2Cargo / matches.length).toFixed(1),
            teleopRocket3Cargo: +(teleopRocket3Cargo / matches.length).toFixed(1),
            teleopDroppedCargo: +(teleopDroppedCargo / matches.length).toFixed(1),
            cargoPickupTime: +(cargoPickupTime.asSeconds() / matches.length).toFixed(1),
            cargoDropoffTime: +(cargoDropoffTime.asSeconds() / matches.length).toFixed(1),
            cargoSuccessPercent: +(cargoSuccessPercent / matches.length).toFixed(1),
            totalCargo: +(totalCargo / matches.length).toFixed(1),
            teleopCargoshipHatch: +(teleopCargoshipHatch / matches.length).toFixed(1),
            teleopRocket1Hatch: +(teleopRocket1Hatch / matches.length).toFixed(1),
            teleopRocket2Hatch: +(teleopRocket2Hatch / matches.length).toFixed(1),
            teleopRocket3Hatch: +(teleopRocket3Hatch / matches.length).toFixed(1),
            teleopDroppedHatch: +(teleopDroppedHatch  / matches.length).toFixed(1),
            hatchPickupTime: +(cargoPickupTime.asSeconds() / matches.length).toFixed(1),
            hatchDropoffTime: +(cargoDropoffTime.asSeconds()/ matches.length).toFixed(1),
            hatchSuccessPercent: +(hatchSuccessPercent / matches.length).toFixed(1),
            totalHatch: +(totalHatch / matches.length).toFixed(1),
            climbingDuration: +(climbingDuration.asSeconds() / matches.length).toFixed(1),
            pointsEarned: +(pointsEarned / matches.length).toFixed(1),
            climbingType: mode(climbingType),
            climbingGaveAssistance: +((climbingGaveAssistance / matches.length) * 100).toFixed(1),
            climbingGotAssistance: +((climbingGotAssistance / matches.length) * 100).toFixed(1),
            speed: +(speed / matches.length).toFixed(1),
            stability: +(stability / matches.length).toFixed(1),
            driverSkill: +(driverSkill / matches.length).toFixed(1),
            defence: +(defence / matches.length).toFixed(1),
            anythingBreak: +((anythingBreak / matches.length) * 100).toFixed(1),
            dead: +((dead / matches.length) * 100).toFixed(1)
        }
    } catch (err) {
        return err;
    }
}

module.exports = {
    getTeamMatch,
    getAllTeamMatches,
    getTeamPit,
    getTeamAverage
}