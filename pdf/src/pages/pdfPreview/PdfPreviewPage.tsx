import {
  ERROR_NAMES,
  getDynatraceActionName,
  getLabel,
  isBlankEmpty,
  isInWorkflow,
  isNotBlankEmpty,
  selectSessionParams
} from '@dxs/coreenablers-fe-common-library'
import { ColLayout, RowLayout, Title } from '@dxs/dxs-components-library-v3'
import { Button, Spinner } from '@g4p/react-styleguide-library'
import { PDFViewer, PrintDocumentV2 } from '@omn/react-component-library'
import React, { type ReactElement, useEffect, useState } from 'react'
import { type TAttachmentDetailPageUrlState } from 'src/data/constants/type'
import { useAppDispatch, useAppSelector } from 'src/data/stores/hooks'
import { selectDocuments, selectIsRpaFlow } from 'src/features/documentList/slices/DocumentsSlice'
import { useFetchPreview } from 'src/hooks/useFetchDocPreview'
import { type TPdfPreviewSessionParams } from 'src/models/sessionParams.props'
import './PdfPreviewPage.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import ROUTES from 'src/data/routes/routes.const'
import PdfDownloadButton from 'src/features/pdfpreview/components/PdfDownloadButton'
import CONFIG from 'data/config'
import { triggerErrorPageNavigation } from 'src/utils'
import NavBarHeader from 'src/components/navbarHeader/NavBarHeader'
import useCallbackEvent from 'src/hooks/useCallbackEvent'
import RejectConfirmButtons from 'src/components/rejectConfirmButtons/RejectConfirmButtons'
import { Dynatrace } from '@omn/react-ark-library'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'src/data/constants'

const { MIME_TYPE, CHIOSK_CHANNELS } = CONFIG

export type TPdfPreviewState = {
  documentId: number
}

export type TPdfPreviewDoc = TAttachmentDetailPageUrlState & {
  description: string
}

export default function PdfPreviewPage(): ReactElement {
  const {
    groupKey,
    dxsDossierId,
    showPrintButton,
    hideCloseButton,
    showDownloadButton,
    hideTitle,
    channel,
    showValidationButtons
  } = useAppSelector(selectSessionParams) as TPdfPreviewSessionParams
  const dispatch = useAppDispatch()
  const { triggerCallback } = useCallbackEvent()
  const [pdfDoc, setPdfDoc] = useState<TPdfPreviewDoc>()
  const navigate = useNavigate()
  const { fetchDocument } = useFetchPreview({ useGlobalLoader: false })
  const documentList = useAppSelector(selectDocuments)
  const isRpaFlow = useAppSelector(selectIsRpaFlow)
  const location = useLocation()

  const showPrintOption = showPrintButton && !CHIOSK_CHANNELS.CHANNELS.includes(channel as string)
  const { documentId } = location.state as TPdfPreviewState

  const isOnlyDocumentInGroup = documentList.length === 1
  const showWorkflowButtons = isInWorkflow()
  const showCloseButton = !hideCloseButton && showWorkflowButtons

  useEffect(() => {
    if (isBlankEmpty(documentList)) return
    void (async () => {
      const { storeId, storageType, description } =
        documentList.find((document) => document.documentId === documentId) ?? documentList[0]
      const fetchedDocumentPreview = await fetchDocument({ storeId, storageType })
      if (fetchedDocumentPreview === null) {
        triggerErrorPageNavigation({
          name: ERROR_NAMES.NOT_FOUND,
          message: 'PDF preview document has not been found.',
          groupKey,
          dxsDossierId,
          dispatch
        })
      } else {
        setPdfDoc({ ...fetchedDocumentPreview, description })
        console.log('test')
      }
    })()
  }, [documentList])

  function navigateToDocumentListPage(): void {
    Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_DOCUMENT_LIST_PAGE))
    navigate(ROUTES.DOCUMENT_LIST)
    Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_DOCUMENT_LIST_PAGE))
  }

  return isNotBlankEmpty(pdfDoc) && pdfDoc !== undefined ? (
    <>
      <NavBarHeader
        backButtonFunc={navigateToDocumentListPage}
        closeIconFunc={triggerCallback}
        showBackButton={!isOnlyDocumentInGroup}
        showCloseButton={showWorkflowButtons}
      />
      {!hideTitle && (
        <RowLayout>
          <ColLayout>
            <Title level={2} style={{ textTransform: 'none' }}>
              {pdfDoc.description}
            </Title>
          </ColLayout>
        </RowLayout>
      )}
      <RowLayout>
        <ColLayout className="pdf-col">
          {showPrintOption ? (
            <PrintDocumentV2 document={`data:${MIME_TYPE.PDF};base64,${pdfDoc.fileUrl}`} setZoom={8} scale={0.58} />
          ) : (
            <PDFViewer
              className="pdf-viewer"
              pdfSourceFile={`data:${MIME_TYPE.PDF};base64,${pdfDoc.fileUrl}`}
              setZoom={8}
              scale={0.58}
            />
          )}
          {isRpaFlow && (
            <p style={{ textAlign: 'center', marginTop: '0.7rem' }}>
              <strong>{getLabel('DXS_PDFPREVIEW_ONLY_INTERNAL_USE')}</strong>
            </p>
          )}
        </ColLayout>
      </RowLayout>
      {showDownloadButton && <PdfDownloadButton fileName={pdfDoc.fileName} fileUrl={pdfDoc.fileUrl} />}

      <RowLayout className="back-close-button-row">
        {!isOnlyDocumentInGroup ? (
          <ColLayout>
            <Button
              className="full-width-on-small"
              type="default"
              onClick={() => {
                Dynatrace.createCustomAction(
                  getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_DOCUMENT_LIST_PAGE)
                )
                navigate(ROUTES.DOCUMENT_LIST)
                Dynatrace.leaveCustomAction(
                  getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_DOCUMENT_LIST_PAGE)
                )
              }}
            >
              {getLabel('DXS_PDFPREVIEW_BACK_BTN')}
            </Button>
          </ColLayout>
        ) : (
          <>
            {showValidationButtons && <RejectConfirmButtons wholeRow={!showCloseButton} />}
            {showCloseButton && (
              <ColLayout size={showValidationButtons ? 1 : 12} className={'coreenablers-flex-center-position'}>
                <Button className="full-width-on-small" type="primary" onClick={triggerCallback}>
                  {getLabel('DXS_PDFPREVIEW_CLOSE_BTN')}
                </Button>
              </ColLayout>
            )}
          </>
        )}
      </RowLayout>
    </>
  ) : (
    <Spinner label={'Fetching document, please wait...'} show />
  )
}
