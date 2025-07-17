export const DYNATRACE_PREFIX = 'DXS-UCX'
export const DYNATRACE_APP_NAME = 'PDF_PREVIEW_GLOBAL'
export const DYNATRACE_ACTIONS = {
  APP_ENAGAGE: `${DYNATRACE_PREFIX}_PdfPreviewGlobal`, // ex. _EnterpriseDashboardGlobal
  ERROR_INVALID_REQUEST: 'InvalidRequest',
  ROUTE_CHANGE: 'RouteChangedTo-',
  ERROR_PAGE: 'ErrorPage',

  // Post message
  SEND_CLOSE_POST_MESSAGE: 'ClosePostMessage',

  // API calls
  GET_PDF_PREVIEW: 'GetPDFPreview',
  PROMOTE_ARCHIVE_TO_SIGN: 'PromoteArchiveToSign',
  FETCH_DOSSIER_DETAILS: 'FetchDossierDetails',

  // Page interactions
  INITIALIZE_PARAMS: 'InitializeParams',
  GO_BACK_ACTION: 'GoBackAction',
  CLOSE_ACTION: 'closeIconAction',
  REJECT_ACTION: 'RejectAction',
  DOWNLOAD_PDF: 'DownloadPdf',
  OPEN_FAQ_MODAL: 'OpenFAQModal',

  // Open page
  OPEN_PDF_PREVIEW_PAGE: 'OpenPDFPreviewPage',
  OPEN_DOCUMENT_LIST_PAGE: 'OpenDocumentListPage',

  // Open Mfe
  OPEN_WIZARD_MFE: 'OpenWizardMfe',
  OPEN_DASHBOARD_MFE: 'OpenDashboardMfe'
}
