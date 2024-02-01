import Koa from "koa";
import Router from "koa-router";
import { koaBody } from "koa-body";
import cors from "koa-cors";
import users from "./users";
import items, { Item, RichItem } from "./items";
import { Server, Socket } from "socket.io"
import { ActionResponse, Client2ServerEvents, Message, MockMessage, Server2ClientEvents } from "./socket.types";
import fs from "fs";
import { createThread } from "./openai-adapter";
import { MessageContentText } from "openai/resources/beta/threads/messages/messages";
import { ToolCallsStepDetails } from "openai/resources/beta/threads/runs/steps";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Threads } from "openai/resources/beta/threads/threads";
import functionHandlers from "./functions";

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
  const body = ctx.request.body;
  if (testSocket) {
    let message: MockMessage;
    if (body.type === 'text') {
      message = {
        client: false,
        type: 'text',
        data: body.data,
      };
      testSocket.emit('mockMessage', message);
      ctx.body = 'message sent';
    } else if (body.type === 'component') {
      const component = body.component;
      const html = fs.readFileSync(`./assets/${component}.html`, 'utf-8');
      message = {
        client: false,
        type: 'component',
        data: html,
      };
      testSocket.emit('mockMessage', message);
      ctx.body = 'message sent';
    } else {
      // do nothing
    }
  } else {
    ctx.body = 'no socket';
  }
});

router.get("/assets/:filename", (ctx, next) => {
  const filename = ctx.params.filename;
  const filePath = `./assets/${filename}`;
  if (fs.existsSync(filePath)) {
    ctx.attachment(filename);
    ctx.body = fs.createReadStream(filePath);
  } else {
    ctx.status = 404;
    ctx.body = 'File not found';
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
  createThread().then(thread => {
    const callbacks = {
      'completed': (message: MessageContentText) => {
        socket.emit('message', {
          type: 'text',
          data: message.text.value
        });
      },
      'requires_action': async (toolCall: Threads.Runs.RequiredActionFunctionToolCall) => {
        // only support one tool call now
        const functionName = toolCall.function.name;
        const handler = functionHandlers[functionName];
        if (!handler) {
          throw new Error(`Function ${functionName} not found`);
        }
        const result = await handler.call(toolCall.function.arguments, toolCall.id);
        if (handler.isInteractive) {
          socket.emit('message', {
            type: 'component',
            data: result
          })
        } else {
          thread.submitToolOutputs([
            {
              tool_call_id: toolCall.id,
              output: result
            }
          ], callbacks);
        }
      }
    };
    socket.on('message', (message: Message) => {
      thread.sendMessage(message.data, callbacks);
    });

    socket.on('actionResponse', (res: ActionResponse) => {
      console.log(res);
      thread.submitToolOutputs([
        {
          tool_call_id: res.toolCallId,
          output: res.data
        }
      ], callbacks);
    });
  });
});

function richItem(item: Item): RichItem {
  return {
    ...item,
    assignee: users.find((user) => user.id === item.assignee)!,
  };
}