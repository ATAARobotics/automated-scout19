const Koa = require('koa');
const Router = require('koa-router');
const tba = require('./tba');
const pug = require('pug');
const NodeCache = require("node-cache");

const cache = new NodeCache();

const router = new Router();

//Views

const addView = (path, view, getModel) => {
  router.get(path, async (ctx) => {
    const model = await getModel(ctx);
    if (ctx.query.json == 'true') {
      ctx.body = model; return;
    } else {
      ctx.body = pug.renderFile(`./views/${view}.pug`, model);
    }
  });
};

addView('/', 'index', async (ctx) => {
  const calendarEvents = [];
  found = cache.get("eventCalendar");
  if (found == undefined) {
    const events = await tba.get('/events/2018/simple');

    for (var item = 0, length = events.length; item < length; item++) {
      var event = {
        "title": events[item].name,
        "start": events[item].start_date,
        "end": events[item].end_date,
        "url": `/events/${events[item].key}`
      }
      calendarEvents.push(event);
    }
    cache.set("calendarEvents", calendarEvents, 10000);
  } else {
    calendarEvents = found;
  }

  return { calendarEvents };

});
addView('/clearcache', 'clearcache', async (ctx) => {
  cache.flushAll();
  var cacheStats = cache.getStats();
  return { cacheStats };
});

addView('/cachestats', 'cachestats', async (ctx) => {
  var cacheStats = cache.getStats();
  return { cacheStats };
});


new Koa()
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT || 4334);

console.log(`Server on localhost:${process.env.PORT || 4334}`);
