import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { Client2ServerEvents, Server2ClientEvents, Message as SocketMessage, MockMessage } from "../../server/src/socket.types"
import Messages, { MessageTypeWithClient } from "./Messages"

// type Message = SocketMessage & {
//   client: boolean
// }

function App() {
  const [socket, setSocket] = useState<Socket<Server2ClientEvents, Client2ServerEvents> | null>(null)
  useEffect(() => {
    setSocket(io("http://localhost:3001"))
  }, [])
  useEffect(() => {
    const iframeMessageHandler = (e: MessageEvent) => {
      console.log(e)
      socket?.emit("actionResponse", e.data);
    }
    window.addEventListener("message", iframeMessageHandler);
    return () => {
      window.removeEventListener("message", iframeMessageHandler);
    }
  }, [socket])
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connected")
      })
      socket.on("disconnect", () => {
        console.log("disconnected")
      })
      socket.on("message", (message: SocketMessage) => {
        // console.log(message)
        setMessages((messages) => [...messages, { ...message, client: false }])
      })
      socket.on("mockMessage", (message: MockMessage) => {
        // console.log(message)
        setMessages((messages) => [...messages, message])
      })
      return () => {
        socket.disconnect()
      }
    }
  }, [socket])
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<MessageTypeWithClient[]>([])
  const handleSend = () => {
    if (socket) {
      const m: SocketMessage = {
        // client: true,
        type: 'text',
        data: message
      };
      socket.emit("message", m);
      setMessage("");
      setMessages((messages) => [...messages, { ...m, client: true }]);
    }
  }
  return (
    <Stack spacing={2} sx={{ p: 2, height: '100vh', boxSizing: 'border-box'}}>
      <Box sx={{flexGrow: 1}}>
          <Messages messages={messages}/>
      </Box>
          
      <Stack spacing={2} direction="row" sx={{ width: "100%" }}>
        <TextField
          sx={{ flexGrow: 1 }}
          id="outlined-basic"
          placeholder="Send message to LLM..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="outlined"
        />
        <Button onClick={() => handleSend()} variant="contained">Send</Button>
      </Stack>
    </Stack>
  )
}

export default App
