import React, { type ReactElement } from 'react'
import { ArrowRightIcon, Button } from '@g4p/react-styleguide-library'
import { ColLayout, RowLayout } from '@dxs/dxs-components-library-v3'
import './DocumentLink.scss'
import { type TDocumentData } from 'src/data/constants/type'
import { useNavigate } from 'react-router-dom'
import ROUTES from 'src/data/routes/routes.const'
import { Dynatrace } from '@omn/react-ark-library'
import { getDynatraceActionName } from '@dxs/coreenablers-fe-common-library'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'src/data/constants'

type TDocumentLinkPros = {
  document: TDocumentData
}

export default function DocumentLink({ document }: Readonly<TDocumentLinkPros>): ReactElement {
  const { tileName, name, documentId } = document
  const navigate = useNavigate()

  return (
    <RowLayout className="documentList-row">
      <ColLayout size={12}>
        <Button
          icon={<ArrowRightIcon />}
          iconPosition="end"
          title={tileName != null ? tileName : name}
          type="text"
          onClick={() => {
            Dynatrace.createCustomAction(
              getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_PDF_PREVIEW_PAGE)
            )
            navigate(ROUTES.PDF_PREVIEW, { state: { documentId } })
            Dynatrace.leaveCustomAction(
              getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.OPEN_PDF_PREVIEW_PAGE)
            )
          }}
        >
          {tileName != null ? tileName : name}
        </Button>
      </ColLayout>
    </RowLayout>
  )
}
