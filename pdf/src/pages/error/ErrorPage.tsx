import React, { useCallback } from 'react'
import { useRouteError } from 'react-router-dom'
import {
  ERROR_NAMES,
  ErrorView,
  getDynatraceActionName,
  isNotBlankEmpty,
  isNotNullOrUndefined,
  selectErrorResponse,
  type TErrorNameType,
  type TErrorParamType,
  type TErrorResponseState,
  type TErrorViewDisplayInjectedProps
} from '@dxs/coreenablers-fe-common-library'
import { Dynatrace } from '@omn/react-ark-library'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'data/constants'
import { ErrorViewDisplay } from '@dxs/dxs-components-library-v3'
import { useAppSelector } from 'stores/hooks'

type TErrorPagePropsType = Omit<TErrorParamType, 'name'> & { name?: TErrorNameType }

/**
 * ErrorPage is a component that is displayed when an error occurs. It takes in an optional parameter errorParams, which is an object that contains the error name, message, and details. If no errorParams are provided, it will use the error that is provided by the useRouteError hook.
 * @param errorParams - An object that contains the error name, message, and details.
 * @param showButton - A boolean value that determines whether to show the button to refresh the application page.
 * @returns A React element that displays the error.
 */
export default function ErrorPage(errorParams?: TErrorPagePropsType, showButton = true): React.ReactElement {
  const error = useRouteError()
  const storeError = useAppSelector(selectErrorResponse)

  const activeError = isNotBlankEmpty(errorParams)
    ? (errorParams as TErrorResponseState)
    : isNotBlankEmpty(error)
      ? (error as TErrorResponseState)
      : storeError

  if (isNotBlankEmpty(activeError)) console.error(activeError)

  const getErrorMessage = useCallback((): TErrorParamType => {
    Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.ERROR_PAGE))

    if (isNotBlankEmpty(activeError)) {
      Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.ERROR_PAGE))
      return {
        name: isNotBlankEmpty(activeError?.name) ? (activeError?.name as TErrorNameType) : ERROR_NAMES.TECHNICAL_ERROR,
        message: isNotBlankEmpty(activeError?.message) ? activeError?.message : undefined,
        details: isNotBlankEmpty(activeError?.details) ? activeError?.details : undefined
      }
    }
    return {
      name: ERROR_NAMES.TECHNICAL_ERROR,
      message: isNotNullOrUndefined(activeError) ? activeError : null
    }
  }, [])

  return (
    <ErrorView errorProps={getErrorMessage()} showButton={showButton} shouldClearStateSessionStorageKeys={true}>
      {(props: TErrorViewDisplayInjectedProps) => <ErrorViewDisplay {...props} />}
    </ErrorView>
  )
}
