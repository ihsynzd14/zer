/**
 * Contains the public routes for the application.
 */

import React from 'react'
import { safeLazy } from 'react-safe-lazy'
import ROUTES from 'routes/routes.const'
import ErrorPage from 'pages/error/ErrorPage'

type TRouteChildrenProps = {
  index?: boolean
  path?: string
  element: React.ReactElement
}

// Lazy loading imports of route's children ui
const DocumentListPage = safeLazy(async () => await import('pages/documentList/DocumentListPage'))
const PdfPreviewPage = safeLazy(async () => await import('pages/pdfPreview/PdfPreviewPage'))

/**
 * Array of public routes that will be rendered by the App component.
 */
export const publicRoutes: TRouteChildrenProps[] = [
  {
    index: true,
    path: ROUTES.DOCUMENT_LIST,
    element: <DocumentListPage />
  },
  {
    index: true,
    path: ROUTES.PDF_PREVIEW,
    element: <PdfPreviewPage />
  },
  {
    index: true,
    path: ROUTES.ERROR_PAGE,
    element: <ErrorPage />
  }
]
