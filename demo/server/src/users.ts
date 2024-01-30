const users: User[] = [
  {
    "displayName": "Alice Johnson",
    "id": 1001
  },
  {
    "displayName": "Bob Smith",
    "id": 1002
  },
  {
    "displayName": "Eva Martinez",
    "id": 1003
  },
  {
    "displayName": "David Anderson",
    "id": 1004
  },
  {
    "displayName": "David Lee",
    "id": 1005
  }
]

export type User = {
  displayName: string
  id: number
}

export default users;