import React from "react"
import ReactDOMServer from "react-dom/server"
import CreateItem from "../../components/CreateItem"
import withIsland from "../../components/isLandWrapper"

const CreateItemWithIsland = withIsland(CreateItem)

// @ts-expect-error - not checking type here
export default function render(props) {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <CreateItemWithIsland {...props} />
    </React.StrictMode>
  )
}
