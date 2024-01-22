import Item from "./components/Item"
import Stack from "@mui/material/Stack"
import useAxios from "axios-hooks"
import { RichItem } from "../../server/src/items"
import Button from "@mui/material/Button"
import Drawer from "@mui/material/Drawer"
import { Fragment, useState } from "react"

export default function App() {
  const [{ data }] = useAxios("http://localhost:3000/items");
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Stack spacing={2} sx={{ width: 500 }}>
        {data?.map((item: RichItem) => (
          <Item key={item.id} {...item} />
        ))}
        <Button onClick={() =>setOpen(true)} variant="contained">Add</Button>
      </Stack>
      <Drawer anchor="right" open={open}>
        <div onClick={() =>setOpen(false)}>123123</div>
      </Drawer>
    </Fragment>
  )
}
