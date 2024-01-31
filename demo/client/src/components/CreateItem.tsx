import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import { Button } from "@mui/material"
import axios from "axios"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import useAxios from "axios-hooks"
import { User } from "../../../server/src/users"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import dayjs from "dayjs"
import React, { useState } from "react"

export default function CreateItem({
  setOpen,
  refetch,
  data: initData = {name: '', description: '', assignee: 0, due: dayjs().toISOString()},
  responseToLLM,
}: {
  setOpen?: (open: boolean) => void
  refetch?: () => void
  data?: CreateItemProps
  responseToLLM?: (res: string) => void
}) {
  const [data, setData] = useState<CreateItemProps>(initData)
  const handleCreate = () => {
    axios
      .post("http://localhost:3000/items", {
        name: data.name,
        description: data.description,
        assignee: data.assignee,
        due: data.due,
      })
      .then((res) => {
        setOpen?.(false)
        refetch?.()
        responseToLLM?.("Item created with id " + res.data.id)
      })
  }
  return (
    <Stack spacing={2} sx={{ width: 500, p: 2 }}>
      <TextField
        id="name"
        label="Name"
        variant="outlined"
        value={data?.name}
        onChange={(v) => setData({ ...data, name: v.target.value })}
      />
      <TextField
        id="des"
        label="Description"
        variant="outlined"
        value={data?.description}
        onChange={(v) => setData({ ...data, description: v.target.value })}
      />
      <UserSelect value={data?.assignee} onChange={(v) => setData({ ...data, assignee: v })}/>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker value={dayjs(data?.due)} onChange={v => setData({ ...data, due: v?.toISOString()})}/>
      </LocalizationProvider>
      <Stack direction="row" spacing={2}>
        <Button onClick={handleCreate} variant="contained">
          Create
        </Button>
        <Button onClick={() => setOpen?.(false)} variant="outlined">
          Cancel
        </Button>
      </Stack>
    </Stack>
  )
}

function UserSelect({ value, onChange }: { value: number | undefined, onChange: (e: number) => void }) {
  const [{ data }] = useAxios("http://localhost:3000/users")
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Assignee</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        onChange={e => onChange(+e.target.value)}
      >
        {data?.map((user: User) => (
          <MenuItem key={user.id} value={user.id}>
            {user.displayName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export type CreateItemProps = {
  name: string
  description: string
  assignee: number
  due: string | undefined
}
