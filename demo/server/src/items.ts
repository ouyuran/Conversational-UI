import { User } from './users';

const items: Item[] = [
  {
    id: 1,
    "name": "Complete Project Proposal",
    "description": "Write and finalize the project proposal for upcoming client meeting.",
    "assignee": 1001,
    "due": "2024-02-15T18:00:00Z"
  },
  {
    id: 2,
    "name": "Buy Groceries",
    "description": "Purchase essential groceries for the week.",
    "assignee": 1002,
    "due": "2024-02-10T12:00:00Z"
  },
  {
    id: 3,
    "name": "Review Code Changes",
    "description": "Review and provide feedback on recent code changes.",
    "assignee": 1003,
    "due": "2024-02-20T16:30:00Z"
  },
  {
    id: 4,
    "name": "Prepare Presentation",
    "description": "Create a presentation for the upcoming team meeting.",
    "assignee": 1004,
    "due": "2024-02-18T09:00:00Z"
  }
]

export type Item = {
  id: number
  name: string
  description: string
  assignee: number
  due: string
}

export type RichItem = {
  id: number
  name: string
  description: string
  assignee: User
  due: string
}

export default items;