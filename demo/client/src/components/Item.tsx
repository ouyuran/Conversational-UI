import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RichItem } from "../../../server/src/items"
import PermIdentityIcon from "@mui/icons-material/PermIdentity"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import Paper from "@mui/material/Paper"

export default function Item(item: RichItem) {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h5">{item.name}</Typography>
        <Typography variant="body1">{item.description}</Typography>
        <Stack direction="row" spacing={2}>
          <PermIdentityIcon />
          <Typography variant="body1">{item.assignee.displayName}</Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <AccessTimeIcon />
          <Typography variant="body1">{item.due}</Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}
