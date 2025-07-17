import {
  getDynatraceActionName,
  isBlankEmpty,
  selectSessionParams,
  sleep,
  type TCommonApiOptionsProps,
  useFetchPdfPreviewData
} from '@dxs/coreenablers-fe-common-library'
import { type TAttachmentDetailPageUrlState } from 'src/data/constants/type'
import { useAppSelector } from 'src/data/stores/hooks'
import { type TPdfPreviewSessionParams } from 'src/models/sessionParams.props'
import CONFIG from 'data/config'
import { Dynatrace } from '@omn/react-ark-library'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'src/data/constants'

const { MIME_TYPE } = CONFIG

type TDocPreviewProps = {
  storeId: string | number
  storageType: string
}

export type TUseFetchDossierAttachmentResult = {
  fetchDocument: (document: TDocPreviewProps) => Promise<TAttachmentDetailPageUrlState | null>
}

type TUseFetchPreviewProps = TCommonApiOptionsProps

export function useFetchPreview({ ...commonApiOptions }: TUseFetchPreviewProps = {}): TUseFetchDossierAttachmentResult {
  const { fetchPdfPreviewByStoreId } = useFetchPdfPreviewData(commonApiOptions)
  const sessionParams = useAppSelector(selectSessionParams) as TPdfPreviewSessionParams

  async function fetchDocument({
    storeId,
    storageType
  }: Readonly<TDocPreviewProps>): Promise<TAttachmentDetailPageUrlState | null> {
    // this code will run to up to 5 times with 3 seconds wait -> recursive function
    // TODO -> To test with a file who has json format for a brief moment, if possible
    const attemptFetch = async (attempt: number): Promise<TAttachmentDetailPageUrlState | null> => {
      if (attempt >= 5) return null
      Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.GET_PDF_PREVIEW))
      const result = await fetchPdfPreviewByStoreId({
        storeId,
        storageType,
        callerCode: sessionParams.callerCode,
        bankCode: sessionParams.bankCode
      })
      Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.GET_PDF_PREVIEW))
      if (isBlankEmpty(result) || result === null) return null
      if (result.mimeType === MIME_TYPE.JSON) {
        await sleep(3000)
        return await attemptFetch(attempt + 1)
      }

      return result
    }

    return await attemptFetch(0)
  }

  return { fetchDocument }
}
