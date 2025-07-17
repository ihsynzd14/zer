import React, { type ReactElement, Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import {
  getDynatraceActionName,
  navigateToAuth,
  SpinnerView,
  useHandleException,
  useParamValidationAndDefaultInit
} from '@dxs/coreenablers-fe-common-library'
import CONFIG from 'data/config'
import { Dynatrace } from '@omn/react-ark-library'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'data/constants'
import { HeaderView } from '@dxs/dxs-components-library-v3'
import { useInitializeApp } from './hooks/useInitializeApp'

import { PDF_PREVIEW_SESSION_KEYS, type TPdfPreviewSessionParams } from 'src/models/sessionParams.props'

const { STORAGE_PARAMS } = CONFIG

const {
  DXS_DOSSIER_ID,
  GROUP_KEY,
  CALLER_CODE,
  SHOW_X_BUTTON,
  SHOW_PRINT_BUTTON,
  SHOW_DOWNLOAD_BUTTON,
  SHOW_BACK_BUTTON,
  HIDE_TITLE,
  HIDE_CLOSE_BUTTON,
  SHOW_VALIDATION_BUTTON
} = PDF_PREVIEW_SESSION_KEYS

/**
 * This component is the root component for the React application.
 * It is responsible for rendering the navigation bar, the outlet component, and any modals that need to be displayed.
 */
export default function RootRoute({ outlet }: Readonly<{ outlet?: ReactElement }>): ReactElement {
  const hasReachedAuthRetryLimit = useHandleException()
  const location = useLocation()
  const { initializeParams, hasErrorInParams } = useParamValidationAndDefaultInit<TPdfPreviewSessionParams>({
    mandatoryParams: [DXS_DOSSIER_ID, GROUP_KEY, CALLER_CODE],
    defaultValues: {
      [SHOW_X_BUTTON]: false,
      [SHOW_PRINT_BUTTON]: false,
      [SHOW_DOWNLOAD_BUTTON]: false,
      [SHOW_BACK_BUTTON]: false,
      [HIDE_TITLE]: false,
      [HIDE_CLOSE_BUTTON]: false,
      [SHOW_VALIDATION_BUTTON]: false
    }
  })

  // Use the effect to handle the initialization logic
  const initApp = useInitializeApp()

  // Use the returned function in useEffect
  useEffect(() => {
    if (!hasErrorInParams) {
      initApp()
    }
  }, [hasErrorInParams, initApp])

  useEffect(() => {
    Dynatrace.createCustomAction(
      getDynatraceActionName(DYNATRACE_APP_NAME, `${DYNATRACE_ACTIONS.ROUTE_CHANGE}${location.pathname}`)
    )
    Dynatrace.leaveCustomAction(
      getDynatraceActionName(DYNATRACE_APP_NAME, `${DYNATRACE_ACTIONS.ROUTE_CHANGE}${location.pathname}`)
    )
  }, [location])

  useEffect(() => {
    removeStorageParams()
    initializeParams()
    Dynatrace.leaveCustomAction(DYNATRACE_ACTIONS.APP_ENAGAGE)
  }, [])

  /**
   * Function to form and pagination items from session storage
   */
  function removeStorageParams(): void {
    sessionStorage.removeItem(STORAGE_PARAMS.USER_ID_STATE)
  }

  if (!hasReachedAuthRetryLimit) {
    navigateToAuth(window.location.origin + window.location.pathname + window.location.search)
  }

  return (
    <>
      <SpinnerView />
      <div className="coreenablers-root" data-testid="app-container">
        <HeaderView subHeaderText={'DXS'} />
        <div className={'coreenablers-container'}>
          <Suspense fallback={<SpinnerView isLoading={true} />}>{outlet ?? <Outlet />}</Suspense>
        </div>
      </div>
    </>
  )
}
