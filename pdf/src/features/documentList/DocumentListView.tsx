import React, { type ReactElement } from 'react'
import { generateKey, isNotBlankEmpty } from '@dxs/coreenablers-fe-common-library'
import { RowLayout } from '@dxs/dxs-components-library-v3'
import DocumentCard from './components/structure/DocumentCard'
import DocumentLink from './components/structure/DocumentLink'
import { useAppSelector } from 'stores/hooks'
import { selectDocuments, selectIsSimplifiedView } from './slices/DocumentsSlice'
import { Spinner } from '@g4p/react-styleguide-library'

export default function DocumentListView(): ReactElement {
  const documentList = useAppSelector(selectDocuments)
  const isSimplifiedView = useAppSelector(selectIsSimplifiedView)

  const renderDocumentList = (): ReactElement => {
    const documentItems = documentList.map((document) =>
      isSimplifiedView ? (
        <DocumentLink key={generateKey(document)} document={document} />
      ) : (
        <DocumentCard key={generateKey(document)} document={document} />
      )
    )

    return isSimplifiedView ? (
      <>{documentItems}</>
    ) : (
      <RowLayout className="pdfDocList-container-main">{documentItems}</RowLayout>
    )
  }

  return documentList[0] !== undefined && isNotBlankEmpty(documentList[0]) ? renderDocumentList() : <Spinner show />
}
