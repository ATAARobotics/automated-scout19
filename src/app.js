const express = require('express');
const tba = require('./tba');
const scouty = require('./scouty');

var app = express();

//Views

app.set('view engine', 'pug');

const addView = (path, view, dataFunction) => {
    app.get(path, async (req, res) => {
        var data = await dataFunction(req);
        res.render(view, data);
    });
};

app.use(express.static('static'));

addView('/', 'index', async (req) => {
    const calendarEvents = [];
    const events = await tba.get('/events/2019/simple');
    if (events) {
        for (var item = 0, length = events.length; item < length; item++) {
            var event = {
                "title": events[item].name,
                "start": events[item].start_date,
                "end": events[item].end_date,
                "url": `/event/${events[item].key}`
            }
            calendarEvents.push(event);
        }
    }
    return { calendarEvents };
});

addView('/clearcache', 'clearcache', async (req) => {
    var cacheStats = await tba.clearCache();
    return { cacheStats };
});

addView('/cachestats', 'cachestats', async (req) => {
    var cacheStats = await tba.cacheStats();
    var keys = await tba.cacheKeys();
    return { cacheStats, keys };
});

addView('/event/:key', 'event', async (req) => {
    var allMatches = await tba.get(`/event/${req.params.key}/matches/simple`);
    var teams = await tba.get(`/event/${req.params.key}/teams/simple`);
    var matches = [];
    var teamPointCont = await scouty.getPointCont(req.params.key.substr(4, 7) + req.params.key.substr(0, 4), teams);
    var predictedScores = {};
    if (allMatches) {
        for (i = 0; i < allMatches.length; i++) {
            if (allMatches[i].comp_level == "qm") {
                matches.push(allMatches[i]);
            }
        }
        matches.sort(function (a, b) {
            return a.match_number - b.match_number
        });
        for (var i = 0; i < matches.length; i++) {
            predictedScores[matches[i].key] = { 
                red: +(teamPointCont[matches[i].alliances.red.team_keys[0]] + teamPointCont[matches[i].alliances.red.team_keys[1]] + teamPointCont[matches[i].alliances.red.team_keys[2]]).toFixed(1),
                blue: +(teamPointCont[matches[i].alliances.blue.team_keys[0]] + teamPointCont[matches[i].alliances.blue.team_keys[1]] + teamPointCont[matches[i].alliances.blue.team_keys[2]]).toFixed(1)
            }
        }
    }
    if (teams) {
        teams.sort(function (a, b) {
            return a.team_number - b.team_number
        });
    }
    return {
        event: await tba.get(`/event/${req.params.key}/simple`),
        teams: teams,
        matches: matches,
        predictions: await tba.get(`/event/${req.params.key}/predictions`),
        predictedScores: predictedScores
    };
});

addView('/event/:eventKey/match/:matchKey', 'match', async (req) => {
    var predictedScores = {};
    var redScoutyData = [];
    var blueScoutyData = [];
    var match = await tba.get(`/match/${req.params.matchKey}`);
    var red = [];
    var blue = [];
    for (var b = 0; b < 3; b++) {
        blue.push(match.alliances.blue.team_keys[b].substr(3));
    }
    for (var r = 0; r < 3; r++) {
        red.push(match.alliances.red.team_keys[r].substr(3));
    }
    predictedScores[match.key] = await scouty.getAlliancePrediction(req.params.eventKey.substr(4, 7) + req.params.eventKey.substr(0, 4), red, blue);
    for (var i = 0; i < red.length; i++) {
        redScoutyData.push(await scouty.getTeamMatch(req.params.eventKey.substr(4, 7) + req.params.eventKey.substr(0, 4), red[i], 'q', req.params.matchKey.split("_")[1].slice(2)))
    }
    for (var i = 0; i < blue.length; i++) {
        blueScoutyData.push(await scouty.getTeamMatch(req.params.eventKey.substr(4, 7) + req.params.eventKey.substr(0, 4), blue[i], 'q', req.params.matchKey.split("_")[1].slice(2)))
    }
    return {
        event: await tba.get(`/event/${req.params.eventKey}/simple`),
        match: match,
        predictions: await tba.get(`/event/${req.params.eventKey}/predictions`),
        predictedScores: predictedScores,
        blueScoutyData: blueScoutyData,
        redScoutyData: redScoutyData
    };
});

addView('/team/:teamNumber/event/:eventKey', 'teamevent', async (req) => {
    let teamMatches = await scouty.getAllTeamMatches(req.params.eventKey.substr(4, 7) + req.params.eventKey.substr(0, 4), req.params.teamNumber.substr(3));
    let teamPit = await scouty.getTeamPit(req.params.eventKey.substr(4, 7) + req.params.eventKey.substr(0, 4), req.params.teamNumber.substr(3));
    let teamInfo = await tba.get(`/team/${req.params.teamNumber}/simple`)
    return {
        matches: teamMatches,
        pit: teamPit,
        team: teamInfo
    }
});

addView('/event/:eventKey/compare', 'teamCompare', async (req) => {
    let teams = await tba.get(`/event/${req.params.eventKey}/teams/simple`);
    var teamAverages = [];
    for (var i = 0; i < teams.length; i++) {
        teamAverages.push(await scouty.getTeamAverage(req.params.eventKey.substr(4, 7) + req.params.eventKey.substr(0, 4), teams[i].team_number));
    }
    return {
        teamAverages: teamAverages
    }
})

addView('/event/:eventKey/all', 'viewAll', async (req) => {
    return {all: await scouty.getAll(req.params.eventKey.substr(4, 7) + req.params.eventKey.substr(0, 4))}
})

app.get('/test', async (req, res) => {
    let test = await scouty.getTeamAverage('week02019', '501');
    res.send(test);
});

app.listen(process.env.PORT || 4334);

console.log(`Server on localhost:${process.env.PORT || 4334}`);