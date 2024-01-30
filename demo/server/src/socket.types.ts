export interface Client2ServerEvents {
  message: (m: Message) => void;

  actionResponse: (r: ActionResponse) => void;
}

export interface Server2ClientEvents {
  message: (m: Message) => void;
  mockMessage: (m: MockMessage) => void;
  // actionResponse: (r: AcetionResponse) => void;
}

export interface Message {
  // client: boolean
  type: 'text' | 'component'
  data: string
}

export interface MockMessage {
  client: boolean
  type: 'text' | 'component'
  data: string
}

export interface ActionResponse {
  toolCallId: string
  data: string
}