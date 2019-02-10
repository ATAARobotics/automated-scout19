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
  const events = await tba.get('/events/2018/simple');
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
  var matches = [];
  if (allMatches) {
    for (i = 0; i < allMatches.length; i++) {
      if (allMatches[i].comp_level == "qm") {
        matches.push(allMatches[i]);
      }
    }
    matches.sort(function (a, b) {
      return a.match_number - b.match_number
    });
  }
  return {
    event: await tba.get(`/event/${req.params.key}/simple`),
    teams: await tba.get(`/event/${req.params.key}/teams/simple`),
    matches: matches,
    predictions: await tba.get(`/event/${req.params.key}/predictions`)
  };
});

addView('/event/:eventKey/match/:matchKey', 'match', async (req) => {
  return {
    event: await tba.get(`/event/${req.params.eventKey}/simple`),
    match: await tba.get(`/match/${req.params.matchKey}`),
    predictions: await tba.get(`/event/${req.params.eventKey}/predictions`)
  };
});

app.get('/test', async (req, res) => {
  let test = await scouty.exists('test');
  res.send(test);
});

app.listen(process.env.PORT || 4334);

console.log(`Server on localhost:${process.env.PORT || 4334}`);