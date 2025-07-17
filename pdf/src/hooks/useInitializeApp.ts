import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'src/data/stores/hooks'
import {
  DxsError,
  ERROR_NAMES,
  getDynatraceActionName,
  isBlankEmpty,
  isNullOrUndefined,
  newError,
  selectSessionParams,
  type TDocumentDetailResponse,
  useFetchDossierDetails
} from '@dxs/coreenablers-fe-common-library'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'src/data/routes/routes.const'
import { setDocumentList } from 'src/features/documentList/slices/DocumentsSlice'
import { type TDocumentData } from 'data/constants/type'
import toDocumentListInitMapper from 'features/documentList/mapper/documentListInit.mapper'
import type TErrorNameType from '@dxs/coreenablers-fe-common-library/src/data/errors/errorNames.const'
import { triggerErrorPageNavigation } from 'src/utils'
import { Dynatrace } from '@omn/react-ark-library'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'src/data/constants'
import type { TPdfPreviewSessionParams } from 'src/models/sessionParams.props'

export function useInitializeApp(): () => void {
  const dispatch = useAppDispatch()
  const { fetchDossierDetailsWithRetryForType } = useFetchDossierDetails({
    dossierType: 'UCX'
  })
  const navigate = useNavigate()
  const { groupKey, dxsDossierId } = useAppSelector(selectSessionParams) as TPdfPreviewSessionParams
  const sessionParams = useAppSelector(selectSessionParams)

  function initializeNavigation(documentList: TDocumentDetailResponse[]): void {
    if (documentList.length === 1) {
      navigate(ROUTES.PDF_PREVIEW, { state: { documentId: documentList[0].id } })
    } else if (documentList.length > 1) {
      navigate(ROUTES.DOCUMENT_LIST)
    } else {
      triggerErrorPageNavigation({
        name: ERROR_NAMES.NOT_FOUND,
        message: 'No documents found for the given group key and dossier id.',
        groupKey,
        dxsDossierId,
        dispatch
      })
    }
  }

  function validateDocumentDataList(documentDataList: TDocumentData[]): void {
    // Fields to exclude from validation
    const excludedFields = ['tileName']

    documentDataList.forEach((documentData) => {
      Object.entries(documentData).forEach(([key, value]) => {
        if (excludedFields.includes(key)) return
        if (isBlankEmpty(value)) {
          throw new DxsError({
            name: ERROR_NAMES.INVALID_REQUEST,
            message: `The document field "${key}" is empty, null, or blank.`
          })
        }
      })
    })
  }

  return useCallback(() => {
    if (isBlankEmpty(sessionParams)) return
    void (async () => {
      Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.FETCH_DOSSIER_DETAILS))
      const dossierDetailsData = await fetchDossierDetailsWithRetryForType()
      Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.FETCH_DOSSIER_DETAILS))

      if (isNullOrUndefined(dossierDetailsData)) {
        triggerErrorPageNavigation({
          name: ERROR_NAMES.NOT_FOUND,
          message: 'No dossier details found for the given dossier id.',
          groupKey,
          dxsDossierId,
          dispatch
        })
      }
      try {
        const documentListInit = toDocumentListInitMapper(dossierDetailsData)
        if (documentListInit === undefined || isBlankEmpty(documentListInit)) return
        validateDocumentDataList(documentListInit.documents)
        dispatch(setDocumentList(documentListInit))
        initializeNavigation(dossierDetailsData.documentGroups[0]?.documents)
      } catch (error: unknown) {
        dispatch(
          newError({
            name: (error as { name?: TErrorNameType })?.name ?? ERROR_NAMES.TECHNICAL_ERROR,
            message: (error as { message?: string })?.message ?? 'An error occurred while fetching the documents.',
            details: `Dossier ID: ${dxsDossierId}
          Group Key ${groupKey}`,
            forceShowErrorPage: true
          })
        )
      }
    })()
  }, [])
}
