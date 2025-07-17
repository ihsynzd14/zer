import { getLabel, isNotBlankEmpty, selectSessionParams } from '@dxs/coreenablers-fe-common-library'
import { ColLayout, RowLayout, Title } from '@dxs/dxs-components-library-v3'
import React, { type ReactElement } from 'react'
import { useAppSelector } from 'src/data/stores/hooks'
import { type TPdfPreviewSessionParams } from 'src/models/sessionParams.props'
import './TitleAndSubTitle.scss'

export default function TitleAndSubTitle(): ReactElement {
  const sessionParams = useAppSelector(selectSessionParams) as TPdfPreviewSessionParams

  const hideTitle = isNotBlankEmpty(sessionParams.hideTitle) ? sessionParams.hideTitle : false
  return (
    <RowLayout className="document-title-subtitle">
      <ColLayout>
        {!hideTitle && (
          <Title level={2} className="documentList-title" style={{ textTransform: 'none' }}>
            {getLabel('DXS_PDFPREVIEW_PDFLISTPAGE_TITLE_TEXT')}
          </Title>
        )}
        <Title level={5} className="documentList-subTitle" style={{ textTransform: 'none' }}>
          {getLabel('DXS_PDFPREVIEW_PDFLISTPAGE_SUB_TITLE_TEXT')}
        </Title>
      </ColLayout>
    </RowLayout>
  )
}
