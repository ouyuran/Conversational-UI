import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import { Button } from "@mui/material"
import axios from "axios"

export default function CreateItem({
  setOpen,
  refetch
}: {
  setOpen: (open: boolean) => void,
  refetch: () => void
}) {
  const handleCreate = () => {
    axios.post("http://localhost:3000/items", {
      name: "New Item",
      description: "New Description",
      assignee: 1001,
      due: new Date().toISOString()
    }).then(() => {
      setOpen(false);
      refetch();
    })
  }
  return (
    <Stack spacing={2} sx={{ width: 500, p: 2 }}>
      <TextField id="outlined-basic" label="Name" variant="outlined" />
      <TextField id="outlined-basic" label="Description" variant="outlined" />
      <Stack direction="row" spacing={2}>
        <Button onClick={handleCreate} variant="contained">
          Create
        </Button>
        <Button onClick={() => setOpen(false)} variant="outlined">
          Cancel
        </Button>
      </Stack>
    </Stack>
  )
}
