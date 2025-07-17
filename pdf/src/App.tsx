import './App.scss'
import React, { type ReactElement } from 'react'
import { RouterProvider } from 'react-router-dom'
import { routerProvider } from 'routes/routerProvider'
import { type TInitializerProps } from 'src/Initializer'

/**
 * The App component is the root of the application. It provides the router with the routes.
 *
 * Instance of the RouterProvider component is passing it the routerProvider function as a prop.
 * This function returns the router configuration for the app, which is defined in the "data/routes/routerProvider" file.
 * The final line returns the RouterProvider component, which will render the app with the specified router configuration.
 */
export default function App(props: TInitializerProps): ReactElement {
  return <RouterProvider router={routerProvider(props)} />
}
