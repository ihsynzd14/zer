import {
  createURL,
  getDynatraceActionName,
  getLabel,
  isInWorkflow,
  selectSessionParams,
  useSendPostMessage
} from '@dxs/coreenablers-fe-common-library'
import { ColLayout } from '@dxs/dxs-components-library-v3'
import { Button } from '@g4p/react-styleguide-library'
import { Dynatrace } from '@omn/react-ark-library'
import React, { type ReactElement } from 'react'
import CONFIG from 'src/data/config'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'src/data/constants'
import { useAppSelector } from 'src/data/stores/hooks'
import { usePromoteArchiveToSign } from 'src/hooks/usePromoteArchiveToSign'

type TFooterButtons = {
  wholeRow: boolean
}

const { APP_NAME, DOM_EVENT } = CONFIG

export default function RejectConfirmButtons({ wholeRow }: TFooterButtons): ReactElement {
  const { promoteArchiveToSign } = usePromoteArchiveToSign()
  const callerCode = useAppSelector(selectSessionParams).callerCode as string
  const { sendEventToTarget } = useSendPostMessage({ appName: APP_NAME, callerCode })

  function actOnReject(): void {
    Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.REJECT_ACTION))
    if (isInWorkflow()) {
      sendEventToTarget(DOM_EVENT.REJECT)
    } else {
      Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_DASHBOARD_MFE))
      const url = createURL(CONFIG.MF_URL.DASHBOARD)
      window.open(url.build(), '_self', '')
      Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_DASHBOARD_MFE))
    }
    Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.REJECT_ACTION))
  }
  return (
    <>
      <ColLayout size={1}>
        <Button
          className="full-width-on-small"
          role="button"
          type="secondary"
          onClick={() => {
            actOnReject()
          }}
        >
          {getLabel('DXS_PDFPREVIEW_REJECT_BTN')}
        </Button>
      </ColLayout>
      <ColLayout size={wholeRow ? 11 : 10} className={'coreenablers-flex-end-position'}>
        <Button
          className="full-width-on-small"
          role="button"
          type="primary"
          onClick={() => {
            void promoteArchiveToSign()
          }}
        >
          {getLabel('DXS_PDFPREVIEW_CONFIRM_BTN')}
        </Button>
      </ColLayout>
    </>
  )
}
