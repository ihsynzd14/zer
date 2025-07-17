import React from 'react'
import ReactDOM from 'react-dom/client'
import Initializer from './Initializer.tsx'

// Store root instances in a map for unmounting later
const rootMap = new Map()

export const inject = ({ additionalProps, parentElementId }) => {
  const parentElement = document.getElementById(parentElementId)

  if (!parentElement) {
    console.error(`Parent element with id "${parentElementId}" not found.`)
    return
  }

  // Check if a root is already created for this element
  if (rootMap.has(parentElementId)) {
    console.warn(`Root already exists for parentElementId "${parentElementId}". Skipping inject.`)
    return
  }

  // Create root and store it in the map
  const root = ReactDOM.createRoot(parentElement)
  rootMap.set(parentElementId, root)

  // Render the initializer
  root.render(<Initializer {...additionalProps} />)
}

export const unmount = (parentElementId) => {
  // Find the root instance from the map
  const root = rootMap.get(parentElementId)

  if (!root) {
    console.error(`No root found for parentElementId "${parentElementId}".`)
    return
  }

  // Unmount and clean up
  root.unmount()
  rootMap.delete(parentElementId)
}
