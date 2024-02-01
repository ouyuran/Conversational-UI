import React from 'react'
import ReactDOM from 'react-dom/client'
import CreateItem from '../../../components/CreateItem'
import withIsland from '../../../components/isLandWrapper'

const CreateItemWithIsland = withIsland(CreateItem);

ReactDOM.createRoot(document.getElementById('ACTION_ID')!).render(
  <React.StrictMode>
    <CreateItemWithIsland {...(window.toolCallParams)}/>
  </React.StrictMode>,
)