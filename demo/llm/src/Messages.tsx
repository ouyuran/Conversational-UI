import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import Avatar from "@mui/material/Avatar"
import { Message as MessageType } from "../../server/src/socket.types"
import Typography from "@mui/material/Typography"

export type MessageTypeWithClient = MessageType & {
  client: boolean
}

export default function Messages({ messages }: { messages: MessageTypeWithClient[] }) {
  return (
    <Stack spacing={2}>
      {messages.map((message, i) => (
        <Message key={i} message={message} />
      ))}
    </Stack>
  )
}

function Message({ message }: { message: MessageTypeWithClient }) {
  if (message.client) {
    return (
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Paper sx={{ p: 2 }}>
          <TextMessageBody message={message} />
        </Paper>
        <Avatar>U</Avatar>
      </Stack>
    )
  } else {
    return (
      <Stack spacing={2} direction="row">
        <Avatar>A</Avatar>
        <Paper sx={{ p: 2 }}>
          {message.type === "component" ? (
            <ComponentMessageBody message={message} />
          ) : (
            <TextMessageBody message={message} />
          )}
        </Paper>
      </Stack>
    )
  }
}

function TextMessageBody({ message }: { message: MessageType }) {
  return <Typography variant="body1">{message.data}</Typography>
}

function ComponentMessageBody({ message }: { message: MessageType }) {
  return (
    <iframe
      srcDoc={message.data}
      style={{ border: 0, width: 550, height: 380 }}
    />
  )
}
