import React, { type ReactElement } from 'react'
import { Card, DocumentsIcon } from '@g4p/react-styleguide-library'
import './DocumentCard.scss'
import { ColLayout } from '@dxs/dxs-components-library-v3'
import { type TDocumentData } from 'src/data/constants/type'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'src/data/routes/routes.const'
import { getDynatraceActionName, getLabel } from '@dxs/coreenablers-fe-common-library'
import { Dynatrace } from '@omn/react-ark-library'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'src/data/constants'
import CONFIG from 'src/data/config'

type TDocumentCardProps = {
  document: TDocumentData
}

export default function DocumentCard({ document }: Readonly<TDocumentCardProps>): ReactElement {
  const { documentId, tileName, name, description, status } = document
  const navigate = useNavigate()
  const { DOC_STATUS } = CONFIG

  const isUploaded = status === DOC_STATUS.COMPLETED
  return (
    <ColLayout className="card-col" size={6} data-testid="card-root">
      <Card
        size="small"
        type="default"
        icon={<DocumentsIcon />}
        title={tileName !== null ? tileName : name}
        text={description}
        buttonTitle={isUploaded ? status : getLabel('DXS_PDFPREVIEW_PDFDOCLIST_ACTIONTEXT')}
        onClick={
          isUploaded
            ? undefined
            : () => {
                Dynatrace.createCustomAction(
                  getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_PDF_PREVIEW_PAGE)
                )
                navigate(ROUTES.PDF_PREVIEW, { state: { documentId } })
                Dynatrace.leaveCustomAction(
                  getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_PDF_PREVIEW_PAGE)
                )
              }
        }
      />
    </ColLayout>
  )
}
