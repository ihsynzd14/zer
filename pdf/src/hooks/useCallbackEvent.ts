import { useAppSelector } from 'stores/hooks'
import {
  getDynatraceActionName,
  isInWorkflow,
  selectSessionParams,
  useSendPostMessage
} from '@dxs/coreenablers-fe-common-library'
import CONFIG from 'data/config'
import { type TPdfPreviewSessionParams } from 'src/models/sessionParams.props'
import { Dynatrace } from '@omn/react-ark-library'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'src/data/constants'

const { APP_NAME, DOM_EVENT } = CONFIG
type TCallbackResponse = {
  triggerCallback: () => void
}

export default function useCallbackEvent(): TCallbackResponse {
  const { callerCode } = useAppSelector(selectSessionParams) as TPdfPreviewSessionParams
  const { sendEventToTarget } = useSendPostMessage({ appName: APP_NAME, callerCode })

  function triggerCallback(): void {
    if (!isInWorkflow()) return
    Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.SEND_CLOSE_POST_MESSAGE))
    sendEventToTarget(DOM_EVENT.CLOSE)
    Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.SEND_CLOSE_POST_MESSAGE))
  }

  return { triggerCallback }
}
