import z from 'zod';
import fs from "fs";
import users from './users';
import { Run } from 'openai/resources/beta/threads/runs/runs';

type TooLCallHandlerCon = {
  name: string
  description: string
  parameters: z.ZodObject<any, any>
  isInteractive: boolean
  callback: (params: any, toolCallId: string) => any
}

class TooLCallHandler {
  name: string
  description: string
  parameters: z.ZodObject<any, any>
  callback: (param: any, toolCallId: string) => any
  isInteractive: boolean

  constructor(param: TooLCallHandlerCon) {
    this.name = param.name;
    this.description = param.description;
    this.parameters = param.parameters;
    this.isInteractive = param.isInteractive;
    this.callback = param.callback;
  }

  async call(paramsStr: string, toolCallId: string): Promise<any> {
    try {
      const param = this.parameters.parse(JSON.parse(paramsStr));
      return await this.callback(param, toolCallId);
    } catch (error) {
      console.log(error);
    }
  }
}

const createParam = z.object({
  name: z.string().describe('The name of the todo item'),
  description: z.string().describe('The description of the todo item'),
  assignee: z.string().describe('User id of the assignee'),
  dueDate: z.string().describe('The due date of the todo item, this should be date time string that follows ISO 8601 format and have offset information. e.g. 2020-01-01T15:00:00+02:00'),
});
const searchUserParam = z.object({
  name: z.string().describe('The name of the user to search'),
});

const handlers: {
  [key: string]: TooLCallHandler
} = {
  'createTodoItem': new TooLCallHandler({
    name: 'createTodoItem',
    description: 'Create a todo item',
    isInteractive: true,
    parameters: createParam,
    callback: (param: z.infer<typeof createParam>, toolCallId: string): string => {
      // TODO: SSR
      return fs.readFileSync(`./assets/createTodoItem.html`, 'utf-8').replace('TOOL_CALL_ID', toolCallId ?? 'null');
    }
  }),
  'searchUser': new TooLCallHandler({
    name: 'searchUser',
    description: 'Find a user for given name',
    isInteractive: false,
    parameters: searchUserParam,
    callback: (param: z.infer<typeof searchUserParam>): string => {
      return JSON.stringify(users.filter((user) => user.displayName.includes(param.name)));
    }
  })
}

export default handlers;