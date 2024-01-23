export interface Client2ServerEvents {
  message: (m: Message) => void;
}

export interface Server2ClientEvents {
  message: (m: Message) => void;
}

export interface Message {
  client: boolean
  type: string
  data: string
}