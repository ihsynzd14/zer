import { ColLayout, RowLayout } from '@dxs/dxs-components-library-v3'
import { ArrowLeftIcon, CloseIcon, FaqIcon } from '@g4p/react-styleguide-library'
import React, { type ReactElement } from 'react'
import './NavBarHeader.scss'
import {
  getDynatraceActionName,
  isNullOrUndefined,
  selectSessionParams,
  useSendPostMessage
} from '@dxs/coreenablers-fe-common-library'
import { useAppSelector } from 'src/data/stores/hooks'
import CONFIG from 'src/data/config'
import { Dynatrace } from '@omn/react-ark-library'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'src/data/constants'
type TNavBarProps = {
  backButtonFunc?: (() => void) | (() => Promise<void>)
  closeIconFunc?: () => void
  showBackButton?: boolean
  showCloseButton?: boolean
  showHelp?: boolean
}

const { APP_NAME, MFEBUS_EVENT } = CONFIG

export default function NavBarHeader({
  backButtonFunc,
  closeIconFunc,
  showBackButton,
  showCloseButton,
  showHelp
}: TNavBarProps): ReactElement {
  const callerCode = useAppSelector(selectSessionParams).callerCode as string
  const showHelpModalIcon = showHelp
  const { sendEventToMFEBus } = useSendPostMessage({ appName: APP_NAME, callerCode })

  function showHelpModal(): void {
    if (isNullOrUndefined(sessionStorage.getItem(MFEBUS_EVENT.SESSION_PARAM_MFEBUS))) return
    Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_FAQ_MODAL))
    sendEventToMFEBus(MFEBUS_EVENT.SHOW_MODAL)
    Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_FAQ_MODAL))
  }
  return (
    <RowLayout className="navigation-bar-row">
      <ColLayout size={4}>
        {showBackButton && (
          <ArrowLeftIcon
            width={24}
            height={24}
            data-testid="navigation-back-button"
            className="back-left-icon navbar-icon "
            onClick={async () => {
              Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.GO_BACK_ACTION))
              await backButtonFunc?.()
              Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.GO_BACK_ACTION))
            }}
          />
        )}
      </ColLayout>
      <ColLayout size={7} className={'coreenablers-flex-end-position'}>
        {showHelpModalIcon && (
          <FaqIcon width={24} height={24} data-testid="help-button" className="navbar-icon" onClick={showHelpModal} />
        )}
      </ColLayout>
      <ColLayout size={1} className={'coreenablers-flex-end-position'}>
        {showCloseButton && (
          <CloseIcon
            width={24}
            height={24}
            data-testid="navigation-close-button"
            className="navbar-icon"
            onClick={() => {
              Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.CLOSE_ACTION))
              closeIconFunc?.()
              Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.CLOSE_ACTION))
            }}
          />
        )}
      </ColLayout>
    </RowLayout>
  )
}
