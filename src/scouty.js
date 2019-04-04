const fs = require("fs");
const DB_USERNAME = fs.readFileSync('DB_USERNAME', "utf8");
const DB_PASSWORD = fs.readFileSync('DB_PASSWORD', "utf8");
const DB_ADDRESS = fs.readFileSync('DB_ADDRESS', "utf8");
const nano = require("nano")(`http://${DB_USERNAME}:${DB_PASSWORD}@${DB_ADDRESS}:5984`);
const moment = require("moment");

function getTotalSuccessfulDropoffTime(times) {
    var sum = 0;
    if (times.length == 0) {
        return "NA"
    }
    for (var i = 0; i<times.length; i++) {
        if (times[i][2] != "dr") {
            var momentTimeStart = moment.duration(`00:${times[i][0]}00`).asSeconds();
            var momentTimeEnd = moment.duration(`00:${times[i][1]}00`).asSeconds();
            sum += momentTimeStart - momentTimeEnd
        }
    }
    return +(sum).toFixed(1);
}

function getTotalDropoffTime(times) {
    var sum = 0;
    if (times.length == 0) {
        return "NA"
    }
    for (var i = 0; i<times.length; i++) {
        var momentTimeStart = moment.duration(`00:${times[i][0]}00`).asSeconds();
        var momentTimeEnd = moment.duration(`00:${times[i][1]}00`).asSeconds();
        sum += momentTimeStart - momentTimeEnd
    }
    return +(sum).toFixed(1);
}

function findTime(orig, compareTime) {
    var temp = moment.duration('00:02:30').asSeconds();
    for (var i = 0; i < orig.teleopCargoTime.length; i++) {
        var temp2 = moment.duration(`00:${orig.teleopCargoTime[i][1]}00`).asSeconds();
        if (temp2 <= compareTime) {
            break;
        }
        if (temp2 < temp) {
            temp = temp2
        }
    }
    for (var i = 0; i < orig.teleopHatchTime.length; i++) {
        var temp2 = moment.duration(`00:${orig.teleopHatchTime[i][1]}00`).asSeconds();
        if (temp2 <= compareTime) {
            break;
        }
        if (temp2 < temp) {
            temp = temp2
        }
    }
    return +(temp)
}

function getTotalPickupTime(orig, table) {
    var sum = 0;
    if (table.length == 0) {
        return "NA"
    }
    for (var i = 0; i<table.length; i++) {
        var momentTimeStart = findTime(orig, moment.duration(`00:${table[i][0]}00`).asSeconds());
        var momentTimeEnd = moment.duration(`00:${table[i][0]}00`).asSeconds();
        sum += momentTimeStart - momentTimeEnd;
    }
    return +(sum.toFixed(1));
}

function getSandstormHatches(full) {
    var sandstormHatches = 0;
    for (var i = 0; i < full.teleopHatchTime.length; i++) {
        if (moment.duration(`00:${full.teleopHatchTime[i][1]}00`).asSeconds() >= 135) {
            sandstormHatches++
        }
    }
    return sandstormHatches;
}

function getSandstormCargo(full) {
    var sandstormCargo = 0;
    for (var i = 0; i < full.teleopCargoTime.length; i++) {
        if (moment.duration(`00:${full.teleopCargoTime[i][1]}00`).asSeconds() >= 135) {
            sandstormCargo++
        }
    }
    return sandstormCargo
}


function getPointsEarned(full) {
    var totalPoints = 0;
    totalPoints += (full.teleopCargoshipCargo + full.teleopRocket1Cargo + full.teleopRocket2Cargo + full.teleopRocket3Cargo) * 3;
    totalPoints += (full.teleopCargoshipHatch + full.teleopRocket1Hatch + full.teleopRocket2Hatch + full.teleopRocket3Hatch) * 2;
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
    var hatchTotalPickupTime = getTotalPickupTime(orig, orig.teleopHatchTime);
    var hatchTotalDropoffTime = getTotalDropoffTime(orig.teleopHatchTime);
    var hatchTotalSuccessfulDropoffTime = getTotalSuccessfulDropoffTime(orig.teleopHatchTime);
    var cargoTotalPickupTime = getTotalPickupTime(orig, orig.teleopCargoTime);
    var cargoTotalDropoffTime = getTotalDropoffTime(orig.teleopCargoTime);
    var cargoTotalSuccessfulDropoffTime = getTotalSuccessfulDropoffTime(orig.teleopCargoTime);
    orig.sandstormHatches = getSandstormHatches(orig)
    orig.sandstormCargo = getSandstormCargo(orig)
    orig.totalHatch = orig.teleopCargoshipHatch + orig.teleopRocket1Hatch + orig.teleopRocket2Hatch + orig.teleopRocket3Hatch;
    orig.totalCargo = orig.teleopCargoshipCargo + orig.teleopRocket1Cargo + orig.teleopRocket2Cargo + orig.teleopRocket3Cargo;
    orig.averageCargoPickupTime = +(cargoTotalPickupTime / orig.teleopCargoTime.length).toFixed(1) || "NA";
    orig.averageCargoDropoffTime = +(cargoTotalSuccessfulDropoffTime / orig.teleopCargoTime.length).toFixed(1) || "NA";
    orig.averageHatchPickupTime = +(hatchTotalPickupTime / orig.teleopHatchTime.length).toFixed(1) || "NA";
    orig.averageHatchDropoffTime = +(hatchTotalSuccessfulDropoffTime / orig.teleopHatchTime.length).toFixed(1) || "NA";
    orig.hatchCycleTime = orig.averageHatchPickupTime != "NA" && orig.averageHatchDropoffTime != "NA" ? +((orig.averageHatchPickupTime + orig.averageHatchDropoffTime).toFixed(1)) : "NA" ;
    orig.cargoCycleTime = orig.averageCargoPickupTime != "NA" && orig.averageCargoDropoffTime != "NA" ? +((orig.averageCargoPickupTime + orig.averageCargoDropoffTime).toFixed(1)) : "NA";
    orig.climbingDuration = (orig.climbingTime.length != 0 ? moment(moment(orig.climbingTime[0], "mm:ss.S").diff(moment(orig.climbingTime[1], "mm:ss.S"))).format("s.S") : "150");
    orig.cargoSuccessPercent = +(((orig.teleopCargoshipCargo + orig.teleopRocket1Cargo + orig.teleopRocket2Cargo + orig.teleopRocket3Cargo) / (orig.teleopCargoshipCargo + orig.teleopRocket1Cargo + orig.teleopRocket2Cargo + orig.teleopRocket3Cargo + orig.teleopDroppedCargo) * 100).toFixed(1)) || 0;
    orig.hatchSuccessPercent = +(((orig.teleopCargoshipHatch + orig.teleopRocket1Hatch + orig.teleopRocket2Hatch + orig.teleopRocket3Hatch) / (orig.teleopCargoshipHatch + orig.teleopRocket1Hatch + orig.teleopRocket2Hatch + orig.teleopRocket3Hatch + orig.teleopDroppedHatch) * 100).toFixed(1)) || 0;
    orig.cargoEffectiveness = +((cargoTotalPickupTime + cargoTotalSuccessfulDropoffTime) / (cargoTotalPickupTime + cargoTotalDropoffTime) * 100).toFixed(1) || "NA";
    orig.hatchEffectiveness = +((hatchTotalPickupTime + hatchTotalSuccessfulDropoffTime) / (hatchTotalPickupTime + hatchTotalDropoffTime) * 100).toFixed(1) || "NA";
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
            let data = await db.find({"selector": {"_id": {"$regex": `^[q,p][0-9]*_${teamNumber}*$`}}, limit: 10000});
            for (var i = 0; i < data.docs.length; i++) {
                calculated.push(addData(data.docs[i]));
            }
            return calculated;
        } else if (matchType == "p") {
            var calculated = [];
            let data = await db.find({"selector": {"_id": {"$regex": `^p[0-9]*_${teamNumber}*$`}}, limit: 10000});
            for (var i = 0; i < data.docs.length; i++) {
                calculated.push(addData(data.docs[i]));
            }
            return calculated;
        } else if (matchType == "q") {
            var calculated = [];
            let data = await db.find({"selector": {"_id": {"$regex": `^q[0-9]*_${teamNumber}*$`}}, limit: 10000});
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
            if (revs._revs_info[i].status == "available") {
                allRevs.push(await db.get(`pit_${teamNumber}`, {rev: revs._revs_info[i].rev, attachments: true}))
            }
        }
        return allRevs;
    } catch (err) {
        return err;
    }
}

async function getAll (dbName) {
    try {
        const db = await nano.db.use(dbName);
        var all = await db.find({"selector": {"_id": {"$regex": `^[q,p][0-9]*_[0-9]*$`}}, limit: 10000});
        var list = [];
        for (var i = 0; i < all.docs.length; i++) {
            list.push(addData(all.docs[i]))
        }
        return list
    } catch (err) {
        return err;
    }
}

function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}

async function getTeamAverage (dbName, teamNumber, matchType) {
    try {
        let matches = await getAllTeamMatches(dbName, teamNumber, matchType);
        var startingLevel = [];
        var crossedBaseline = 0;
        var sandstormHatches = 0;
        var sandstormCargo = 0;
        var teleopCargoshipCargo = 0;
        var teleopRocket1Cargo = 0;
        var teleopRocket2Cargo = 0;
        var teleopRocket3Cargo = 0;
        var teleopDroppedCargo = 0;
        var cargoPickupTime = 0;
        var cargoPickupTimeNum = matches.length;
        var cargoDropoffTime = 0;
        var cargoDropoffTimeNum = matches.length;
        var cargoCycleTime = 0;
        var cargoCycleTimeNum = matches.length;
        var cargoSuccessPercent = 0;
        var cargoEffectivenessNum = matches.length;
        var cargoEffectiveness = 0;
        var totalCargo = 0;
        var teleopCargoshipHatch = 0;
        var teleopRocket1Hatch = 0;
        var teleopRocket2Hatch = 0;
        var teleopRocket3Hatch = 0;
        var teleopDroppedHatch = 0;
        var hatchPickupTime = 0;
        var hatchPickupTimeNum = matches.length;
        var hatchDropoffTime = 0;
        var hatchDropoffTimeNum = matches.length;
        var hatchCycleTime = 0;
        var hatchCycleTimeNum = matches.length;
        var hatchSuccessPercent = 0;
        var hatchEffectivenessNum = matches.length;
        var hatchEffectiveness = 0;
        var totalHatch = 0;
        var climbingDuration = 0;
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
            crossedBaseline += matches[i].crossedBaseline;
            teleopCargoshipCargo += matches[i].teleopCargoshipCargo;
            sandstormHatches += matches[i].sandstormHatches;
            sandstormCargo += matches[i].sandstormCargo;
            teleopRocket1Cargo += matches[i].teleopRocket1Cargo;
            teleopRocket2Cargo += matches[i].teleopRocket2Cargo;
            teleopRocket3Cargo += matches[i].teleopRocket3Cargo;
            teleopDroppedCargo += matches[i].teleopDroppedCargo;
            matches[i].averageCargoPickupTime == "NA" ? cargoPickupTimeNum-- : cargoPickupTime += matches[i].averageCargoPickupTime;
            matches[i].averageCargoDropoffTime == "NA" ? cargoDropoffTimeNum-- : cargoDropoffTime += matches[i].averageCargoDropoffTime;
            matches[i].cargoCycleTime == "NA" ? cargoCycleTimeNum-- : cargoCycleTime += matches[i].cargoCycleTime
            cargoSuccessPercent += matches[i].cargoSuccessPercent || 0;
            matches[i].cargoEffectiveness== "NA" ? cargoEffectivenessNum-- : cargoEffectiveness += matches[i].cargoEffectiveness;
            totalCargo += matches[i].totalCargo;
            teleopCargoshipHatch += matches[i].teleopCargoshipHatch;
            teleopRocket1Hatch += matches[i].teleopRocket1Hatch;
            teleopRocket2Hatch += matches[i].teleopRocket2Hatch;
            teleopRocket3Hatch += matches[i].teleopRocket3Hatch;
            teleopDroppedHatch += matches[i].teleopDroppedHatch;
            matches[i].averageHatchPickupTime == "NA" ? hatchPickupTimeNum-- : hatchPickupTime += matches[i].averageHatchPickupTime;
            matches[i].averageHatchDropoffTime == "NA" ? hatchDropoffTimeNum-- : hatchDropoffTime += matches[i].averageHatchDropoffTime;
            matches[i].hatchCycleTime == "NA" ? hatchCycleTimeNum-- : hatchCycleTime += matches[i].hatchCycleTime
            hatchSuccessPercent += matches[i].hatchSuccessPercent || 0;
            matches[i].hatchEffectiveness== "NA" ? hatchEffectivenessNum-- : hatchEffectiveness += matches[i].hatchEffectiveness;
            totalHatch += matches[i].totalHatch;
            climbingDuration = matches[i].climbingDuration;
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
            teamNumber: teamNumber,
            startingLevel: mode(startingLevel) || 0,
            crossedBaseline: +((crossedBaseline / matches.length) * 100).toFixed(1) || 0,
            sandstormHatches: +(sandstormHatches / matches.length).toFixed(1) || 0,
            sandstormCargo: +(sandstormCargo/ matches.length).toFixed(1) || 0,
            teleopCargoshipCargo: +(teleopCargoshipCargo / matches.length).toFixed(1) || 0,
            teleopRocket1Cargo: +(teleopRocket1Cargo / matches.length).toFixed(1) || 0,
            teleopRocket2Cargo: +(teleopRocket2Cargo / matches.length).toFixed(1) || 0,
            teleopRocket3Cargo: +(teleopRocket3Cargo / matches.length).toFixed(1) || 0,
            teleopDroppedCargo: +(teleopDroppedCargo / matches.length).toFixed(1) || 0,
            cargoPickupTime: +(cargoPickupTime / cargoPickupTimeNum).toFixed(1) || 0,
            cargoDropoffTime: +(cargoDropoffTime / cargoDropoffTimeNum).toFixed(1) || 0,
            cargoCycleTime: +(cargoCycleTime / cargoCycleTimeNum).toFixed(1) || 0,
            cargoSuccessPercent: +(cargoSuccessPercent / matches.length).toFixed(1) || 0,
            cargoEffectiveness: +(cargoEffectiveness / matches.length).toFixed(1) ||0,
            totalCargo: +(totalCargo / matches.length).toFixed(1) || 0,
            teleopCargoshipHatch: +(teleopCargoshipHatch / matches.length).toFixed(1) || 0,
            teleopRocket1Hatch: +(teleopRocket1Hatch / matches.length).toFixed(1) || 0,
            teleopRocket2Hatch: +(teleopRocket2Hatch / matches.length).toFixed(1) || 0,
            teleopRocket3Hatch: +(teleopRocket3Hatch / matches.length).toFixed(1) || 0,
            teleopDroppedHatch: +(teleopDroppedHatch  / matches.length).toFixed(1) || 0,
            hatchPickupTime: +(hatchPickupTime / hatchPickupTimeNum).toFixed(1) || 0,
            hatchDropoffTime: +(hatchDropoffTime/ hatchDropoffTimeNum).toFixed(1) || 0,
            hatchCycleTime: +(hatchCycleTime / hatchCycleTimeNum).toFixed(1) || 0,
            hatchSuccessPercent: +(hatchSuccessPercent / matches.length).toFixed(1) || 0,
            hatchEffectiveness: +(hatchEffectiveness / matches.length).toFixed(1) || 0,
            totalHatch: +(totalHatch / matches.length).toFixed(1) || 0,
            climbingDuration: +(climbingDuration / matches.length).toFixed(1) || 0,
            pointsEarned: +(pointsEarned / matches.length).toFixed(1) || 0,
            climbingType: mode(climbingType) || 0,
            climbingGaveAssistance: +((climbingGaveAssistance / matches.length) * 100).toFixed(1) || 0,
            climbingGotAssistance: +((climbingGotAssistance / matches.length) * 100).toFixed(1) || 0,
            speed: +(speed / matches.length).toFixed(1) || 0,
            stability: +(stability / matches.length).toFixed(1) || 0,
            driverSkill: +(driverSkill / matches.length).toFixed(1) || 0,
            defence: +(defence / matches.length).toFixed(1) || 0,
            anythingBreak: +((anythingBreak / matches.length) * 100).toFixed(1) || 0,
            dead: +((dead / matches.length) * 100).toFixed(1) || 0
        }
    } catch (err) {
        return err;
    }
}
async function getPointCont (dbName, teams, matchType) {
    try {
        var teamPointCont = {};
        const db = await nano.db.use(dbName);
        for (var i = 0; i < teams.length; i++) {
            if (!matchType) {
                var teamPoints = 0;
                let data = await db.find({"selector": {"_id": {"$regex": `^[q,p][0-9]*_${teams[i].team_number}*$`}}, limit: 10000});
                for (var b = 0; b < data.docs.length; b++) {
                    teamPoints += getPointsEarned(data.docs[b]);
                }
                teamPointCont[teams[i].key] = +(teamPoints / data.docs.length).toFixed(1)
            } else if (matchType == "p") {
                var teamPoints = 0;
                let data = await db.find({"selector": {"_id": {"$regex": `^p[0-9]*_${teams[i].team_number}*$`}}, limit: 10000});
                for (var p = 0; p < data.docs.length; p++) {
                    teamPoints += getPointsEarned(data.docs[p]);
                }
                teamPointCont[teams[i].key] = +(teamPoints / data.docs.length).toFixed(1)
            } else if (matchType == "q") {
                var teamPoints = 0;
                let data = await db.find({"selector": {"_id": {"$regex": `^q[0-9]*_${teams[i].team_number}*$`}}, limit: 10000});
                for (var q = 0; q < data.docs.length; q++) {
                    teamPoints += getPointsEarned(data.docs[q]);
                }
                teamPointCont[teams[i].key] = +(teamPoints / data.docs.length).toFixed(1)
            } else {
                return "Invalid match type"
            }
        }
        return teamPointCont;
    } catch (err) {
        return err;
    }
}

async function getAlliancePrediction (dbName, red, blue) {
    var redScore = 0;
    var blueScore = 0;
    for (var i = 0; i < red.length; i++) {
        try {
            var points = await getTeamAverage(dbName, red[i]);
            redScore += points.pointsEarned;
        } catch {
            redScore = null;
            break;
        }
    }
    if (blue) {
        for (var i = 0; i < blue.length; i++) {
            try {
                var points = await getTeamAverage(dbName, blue[i]);
                blueScore += points.pointsEarned;
            } catch {
                blueScore = null;
                break;
            }
        }
    }
    return {
        red: +redScore.toFixed(1),
        blue: +blueScore.toFixed(1)
    }
}

module.exports = {
    getTeamMatch,
    getAllTeamMatches,
    getTeamPit,
    getAll,
    getTeamAverage,
    getPointCont,
    getAlliancePrediction
}