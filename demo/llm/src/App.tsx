import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { Client2ServerEvents, Server2ClientEvents, Message } from "../../server/src/socket.types"
import Messages from "./Messages"

function App() {
  const [socket, setSocket] = useState<Socket<Client2ServerEvents, Server2ClientEvents> | null>(null)
  useEffect(() => {
    setSocket(io("http://localhost:3001"))
  }, [])
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connected")
      })
      socket.on("disconnect", () => {
        console.log("disconnected")
      })
      socket.on("message", (message: Message) => {
        // console.log(message)
        setMessages((messages) => [...messages, message])
      })
      return () => {
        socket.disconnect()
      }
    }
  }, [socket])
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const handleSend = () => {
    if (socket) {
      const m: Message = {
        client: true,
        type: 'text',
        data: message
      };
      socket.emit("message", m);
      setMessage("")
      setMessages((messages) => [...messages, m])
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
