import Koa from "koa";
import Router from "koa-router";
import { koaBody } from "koa-body";
import cors from "koa-cors";
import users from "./users";
import items, { Item, RichItem } from "./items";
import { Server, Socket } from "socket.io"
import { Client2ServerEvents, Server2ClientEvents } from "./socket.types";

const app = new Koa();
// const server = http.createServer(app.callback());
const io = new Server<
  Client2ServerEvents,
  Server2ClientEvents
>(3001, {
  cors: {
    origin: "*",
  }
});
let testSocket: Socket<Client2ServerEvents, Server2ClientEvents, any>;
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

router.post("/socket", (ctx, next) => {
  const message = ctx.request.body;
  if (testSocket) {
    testSocket.emit('message', message);
    ctx.body = 'message sent';
  } else {
    ctx.body = 'no socket';
  }
});

const port = 3000;

app.use(cors());
app.use(koaBody());
app.use(router.routes());

app.listen(port, () => {
  console.log(`🚀 Server is running on port http://localhost:${port}/`);
});

io.on('connection', (socket) => {
  console.log(`✈️ socket connected`);
  testSocket = socket;
  socket.on('message', (data) => {
    console.log(`📨 message received: ${data}`);
  });
});

function richItem(item: Item): RichItem {
  return {
    ...item,
    assignee: users.find((user) => user.id === item.assignee)!,
  };
}