import { run } from 'node:test';
import OpenAI from 'openai';
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';
import { Run, RunSubmitToolOutputsParams } from 'openai/resources/beta/threads/runs/runs';
import { Threads } from 'openai/resources/beta/threads/threads';

const openai = new OpenAI();
const ASSISTANT_ID = 'asst_wWcFCgdptRsykDyI0IvBnVMv';

interface LLMAdapter {
  createThread: () => Promise<Thread>
}

interface Thread {
  sendMessage: (message: string) => Promise<any>
  submitAction: (action: string) => Promise<any>
}

async function retrieveRun(run: Run, callbacks: RUN_CALLBACKS) {
  while (true) {
    run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
    console.log(run.status);
    switch (run.status) {
      case 'completed':
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        const message = messages.data[0];
        // TODO, only handle text message now
        await callbacks['completed']?.(message.content[0] as MessageContentText);
        return;
      case 'requires_action':
        const toolCall = run.required_action?.submit_tool_outputs?.tool_calls[0] as Threads.Runs.RequiredActionFunctionToolCall;
        await callbacks['requires_action']?.(toolCall);
        return;
      default:
      // do nothing;
    }
    await sleep(1000);
  }
}

  export const createThread = async () => {
    const thread = await openai.beta.threads.create();
    let currentRun: Run;
    return {
      sendMessage: async (message: string, callbacks: RUN_CALLBACKS) => {
        await openai.beta.threads.messages.create(thread.id, {
          role: 'user',
          content: message,
        });
        currentRun = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: ASSISTANT_ID,
          instructions: '',
        });
        retrieveRun(currentRun, callbacks);
      },
      submitToolOutputs: async (outputs: Array<RunSubmitToolOutputsParams.ToolOutput>, callbacks: RUN_CALLBACKS) => {
        await openai.beta.threads.runs.submitToolOutputs(
          thread.id,
          currentRun.id,
          {
            tool_outputs: outputs
          },
        )
        retrieveRun(currentRun, callbacks);
      },
    };
  }

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  type RUN_STAUTS = 'queued'
    | 'in_progress'
    | 'requires_action'
    | 'cancelling'
    | 'cancelled'
    | 'failed'
    | 'completed'
    | 'expired';

  type RUN_CALLBACKS = Partial<{
    'completed': (message: MessageContentText) => void,
    'requires_action': (toolCall: Threads.Runs.RequiredActionFunctionToolCall) => void,
  }>;