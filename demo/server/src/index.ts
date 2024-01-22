import Koa from "koa";
import Router from "koa-router";
import { koaBody } from "koa-body";
import users from "./users";
import items, { Item, RichItem } from "./items";

const app = new Koa();
export const router = new Router();

router.get("/users", (ctx, next) => {
  ctx.body = users;
});

router.get("/users/search", (ctx, next) => {
  const name = ctx.query.name as string;
  ctx.body = users.filter((user) => user.displayName.includes(name));
});

router.get("/items", (ctx, next) => {
  ctx.body = items.map(richItem);
});

router.post("/items", (ctx, next) => {
  const item = ctx.request.body;
  item.id = items.length + 1;
  items.push(item);
  ctx.body = richItem(item);
});

const port = 3000;

app.use(koaBody());
app.use(router.routes());

app.listen(port, () => {
  console.log(`🚀 Server is running on port http://localhost:${port}/`);
});

function richItem(item: Item): RichItem {
  return {
    ...item,
    assignee: users.find((user) => user.id === item.assignee)!,
  };
}