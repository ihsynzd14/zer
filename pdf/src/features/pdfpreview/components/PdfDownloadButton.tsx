import { createBlobFromBase64Content, getDynatraceActionName } from '@dxs/coreenablers-fe-common-library'
import { RowLayout } from '@dxs/dxs-components-library-v3'
import { Button, Col, DownloadIcon } from '@g4p/react-styleguide-library'
import React from 'react'
import { type ReactElement } from 'react-markdown/lib/react-markdown'
import CONFIG from 'data/config'
import { Dynatrace } from '@omn/react-ark-library'
import { DYNATRACE_ACTIONS, DYNATRACE_APP_NAME } from 'src/data/constants'

const { MIME_TYPE } = CONFIG

type TPdfDownloadProps = {
  fileUrl: string
  fileName: string
}

export default function PdfDownloadButton({ fileName, fileUrl }: TPdfDownloadProps): ReactElement {
  const downloadPdf = (): void => {
    Dynatrace.createCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.DOWNLOAD_PDF))
    const downloadBlob = createBlobFromBase64Content(fileUrl, MIME_TYPE.PDF)
    const url = URL.createObjectURL(downloadBlob)

    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = `${fileName}.pdf`
    downloadLink.click()

    URL.revokeObjectURL(url)
    Dynatrace.leaveCustomAction(getDynatraceActionName(DYNATRACE_APP_NAME, DYNATRACE_ACTIONS.DOWNLOAD_PDF))
  }

  return (
    <RowLayout className="download-button-row">
      <Col justifyContent="end">
        <Button
          icon={<DownloadIcon />}
          iconPosition="end"
          onClick={() => {
            downloadPdf()
          }}
          title="download-button"
          type="text"
        />
      </Col>
    </RowLayout>
  )
}
