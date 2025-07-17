import {
  createURL,
  DxsError,
  ERROR_NAMES,
  getDynatraceActionName,
  isInFunction,
  isNotBlankEmpty,
  selectSessionParams,
  type TCommonApiOptionsProps,
  useApiCall,
  useSessionInfo
} from '@dxs/coreenablers-fe-common-library'
import CONFIG from 'src/data/config'
import ENDPOINTS from 'data/constants/endpoints'
import { useAppSelector } from 'stores/hooks'
import { Dynatrace } from '@omn/react-ark-library'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'src/data/constants'

export type TUsePromoteArchiveToSignProps = TCommonApiOptionsProps

export type TPromoteArchiveToSignParams = {
  dossierId: number | string
  documentGroupKey: string
  correlationKey: string
}

export type TUsePromoteArchiveToSignResult = {
  promoteArchiveToSign: () => Promise<unknown>
}

const { CHANNEL_BASE_URL } = CONFIG
const { PROMOTE_ARCHIVE_TO_SIGN } = ENDPOINTS

export function usePromoteArchiveToSign({
  ...commonApiOptions
}: TUsePromoteArchiveToSignProps = {}): TUsePromoteArchiveToSignResult {
  const apiCall = useApiCall()
  const { callerCode, dxsDossierId, correlationKey, groupKey } = useAppSelector(selectSessionParams)
  const sessionInfo = useSessionInfo()

  async function promoteArchiveToSign(): Promise<unknown> {
    const url = createURL(CHANNEL_BASE_URL)
      .addPath(PROMOTE_ARCHIVE_TO_SIGN)
      .addPath(dxsDossierId)
      .addPath(groupKey)
      .addPath(correlationKey)
      .build()

    Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.PROMOTE_ARCHIVE_TO_SIGN))
    const response = await apiCall.put(url, {}, commonApiOptions)
    Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.PROMOTE_ARCHIVE_TO_SIGN))
    // the positive response is a 204 "No Content" so the object is always empty, in case of error
    // a toast will be sent by the BE directly
    if (response) {
      await wizardRedirect() // actual redirect to wizard
      return response
    } else {
      const errorMessage = 'An error occurred while promoting archive dossier to sign.'
      const errorDetails = `Dossier ID: ${dxsDossierId as string}
    Group Key ${groupKey as string}
    Correlation Key ${correlationKey as string}`

      throw new DxsError({
        name: ERROR_NAMES.TECHNICAL_ERROR,
        message: errorMessage,
        details: errorDetails
      })
    }
  }

  async function wizardRedirect(): Promise<void> {
    const body = {
      callerCode,
      dxsDossierId,
      correlationKey
    }

    const dxsSessionId = await sessionInfo.create(body, correlationKey as string, CONFIG.WIZARD_FE_NAME)
    if (isNotBlankEmpty(dxsSessionId)) {
      const url = createURL(CONFIG.MF_URL.WIZARD)
      isInFunction() ? url.addPath(dxsSessionId) : url.addParams({ dxsSessionId })
      Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_WIZARD_MFE))
      window.open(url.build(), '_self', '')
      Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_WIZARD_MFE))
    }
  }

  return { promoteArchiveToSign }
}
