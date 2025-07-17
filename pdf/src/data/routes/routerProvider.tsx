import React from 'react'
import { createMemoryRouter } from 'react-router-dom'
import { dxsLoader } from '@dxs/coreenablers-fe-common-library'
import RootRoute from 'src/RootRoute'
import ROUTES from 'routes/routes.const'
import ErrorPage from 'pages/error/ErrorPage'
import { publicRoutes } from 'routes/publicRoutes'
import CONFIG from 'data/config'
import { type TInitializerProps } from 'src/Initializer'

/**
 * Creates a memory router with routes for the application.
 */
export const routerProvider = (props: TInitializerProps): ReturnType<typeof createMemoryRouter> => {
  const initialEntries = ['/']
  const appAsComponent = Boolean(props?.appAsComponent)
  const additionalDataProcessed =
    props?.additionalData === undefined ? undefined : { [CONFIG.DXS_SESSION_ID_PARAM]: props?.additionalData[0] }
  const engagingParams = appAsComponent ? props : undefined

  return createMemoryRouter(
    [
      {
        /**
         * The first route (ROUTES.APP) is the main route for the application and is wrapped in a loader function that runs optional checks for authentication and session parameters.
         * If the authentication or session parameters are missing or incorrect, the user is redirected to the error page.
         */
        element: <RootRoute />,
        path: ROUTES.APP,
        loader: async () => {
          await dxsLoader({
            runAuthCheck: true,
            runMandatoryQueryParamsCheck: false,
            getSessionParams: true,
            additionalData: additionalDataProcessed,
            appParams: engagingParams,
            runMandatorySessionParamsCheck: true,
            mandatorySessionParams: [...CONFIG.MANDATORY_SESSION_PARAMS]
          })
          return null
        },
        shouldRevalidate: () => false,
        errorElement: <RootRoute outlet={<ErrorPage />} />,
        children: publicRoutes
      },
      {
        element: <RootRoute outlet={<ErrorPage />} />,
        path: ROUTES.ERROR_PAGE
      }
    ],
    {
      initialEntries,
      initialIndex: initialEntries.length - 1
    }
  )
}
