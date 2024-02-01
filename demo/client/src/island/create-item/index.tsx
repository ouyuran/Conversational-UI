import React from 'react'
import ReactDOM from 'react-dom/client'
import CreateItem from '../../components/CreateItem'
import withIsland from '../../components/isLandWrapper'

const CreateItemWithIsland = withIsland(CreateItem);

ReactDOM.hydrateRoot(
  document.getElementById('ACTION_ID')!,
  <React.StrictMode>
    <CreateItemWithIsland {...(window.toolCallParams)}/>
  </React.StrictMode>
)