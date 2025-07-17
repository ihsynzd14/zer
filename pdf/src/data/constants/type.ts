export type TDocumentData = {
  documentId: string | number
  storeId: string | number
  status: string
  code: string
  name: string
  tileName: string | null
  description: string
  storageType: string
}

export type TAttachmentDetailPageUrlState = {
  fileName: string
  fileUrl: string
  mimeType: string
  isReconciliateFlow?: boolean
  shouldHideControls?: boolean
}
