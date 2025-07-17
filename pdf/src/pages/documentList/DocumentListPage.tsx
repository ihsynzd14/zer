import { ColLayout, RowLayout } from '@dxs/dxs-components-library-v3'
import { Button } from '@g4p/react-styleguide-library'
import React, { type ReactElement } from 'react'
import './DocumentListPage.scss'
import { getLabel, isInWorkflow, selectSessionParams, useWorkflowInstances } from '@dxs/coreenablers-fe-common-library'
import TitleAndSubTitle from 'src/features/documentList/components/structure/TitleAndSubTitle'
import DocumentListView from 'features/documentList/DocumentListView'
import { type TPdfPreviewSessionParams } from 'src/models/sessionParams.props'
import { useAppSelector } from 'src/data/stores/hooks'
import CONFIG from 'src/data/config'
import NavBarHeader from 'src/components/navbarHeader/NavBarHeader'
import useCallbackEvent from 'src/hooks/useCallbackEvent'
import RejectConfirmButtons from 'src/components/rejectConfirmButtons/RejectConfirmButtons'

export default function DocumentListPage(): ReactElement {
  const { hideCloseButton, showBackButton, showValidationButtons } = useAppSelector(
    selectSessionParams
  ) as TPdfPreviewSessionParams
  const { triggerCallback } = useCallbackEvent()
  const { backWorkflow } = useWorkflowInstances(CONFIG.WORKFLOW_EVENT.BACK_EVENT_FOR_WF)
  const showWorkflowButtons = isInWorkflow()
  const showCloseButton = !hideCloseButton && showWorkflowButtons
  return (
    <>
      <NavBarHeader
        backButtonFunc={backWorkflow}
        closeIconFunc={triggerCallback}
        showBackButton={showBackButton && showWorkflowButtons}
        showCloseButton={showWorkflowButtons}
        showHelp={showWorkflowButtons}
      />
      <TitleAndSubTitle />
      <DocumentListView />

      <RowLayout className="close-button">
        {showValidationButtons && <RejectConfirmButtons wholeRow={!showCloseButton} />}
        {showCloseButton && (
          <ColLayout size={showValidationButtons ? 1 : 12} className={'coreenablers-flex-end-position'}>
            <Button
              className="full-width-on-small"
              role="button"
              aria-label={getLabel('DXS_PDFPREVIEW_CLOSE_BTN')}
              document-testid="paper-continue-btn"
              type="primary"
              onClick={triggerCallback}
            >
              {getLabel('DXS_PDFPREVIEW_CLOSE_BTN')}
            </Button>
          </ColLayout>
        )}
      </RowLayout>
    </>
  )
}
