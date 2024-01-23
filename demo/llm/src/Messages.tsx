import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import Avatar from "@mui/material/Avatar"
import { Message as MessageType} from '../../server/src/socket.types'
import Typography from "@mui/material/Typography"

export default function Messages({ messages }: { messages: MessageType[]}) {
  return (
    <Stack spacing={2} >
      {messages.map((message, i) => (
          <Message key={i} message={message} />
      ))}
    </Stack>
  )
}

function Message({ message }: { message: MessageType }) {
  if (message.client) {
    return (
      <Stack spacing={2} direction="row" justifyContent="flex-end" >
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1">
            {message.data}
          </Typography>
        </Paper>
        <Avatar>U</Avatar>
      </Stack>
    )
  } else {
    return (
      <Stack spacing={2} direction="row">
        <Avatar>A</Avatar>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1">
            {message.data}
          </Typography>
        </Paper>
      </Stack>
    )
  }
}