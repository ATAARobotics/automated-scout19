const Koa = require('koa');
const Router = require('koa-router');
const tba = require('./tba');
const pug = require('pug');

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

addView('/', 'index',  async (ctx) => {
  const events = await tba.get('/events/2018/simple');
  const calendarEvents = [];
  for (var item = 0, length = events.length; item < length; item++) {
    var event = {
      "title": events[item].name,
      "start": events[item].start_date,
      "end": events[item].end_date,
      "url": `/events/${events[item].key}`
    }
    calendarEvents.push(event);
  }
  return { calendarEvents };

});

new Koa()
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT || 4334);

console.log(`Server on localhost:${process.env.PORT || 4334}`);
