import {
  getAttributeValue,
  getAttributeValueFromContext,
  getAttributeValueWithMatchNameAndContext,
  getDocTitleAndDesc,
  type TDossierDetailResponse,
  type TDocumentDetailResponse,
  isNotBlankEmpty,
  ERROR_NAMES
} from '@dxs/coreenablers-fe-common-library'
import type { TDocumentData } from 'data/constants/type'
import CONFIG from 'data/config'
import { triggerErrorPageNavigation } from 'src/utils'

const { ATTRIBUTES } = CONFIG

export type TDocumentListInit = {
  documents: TDocumentData[]
  isSimplifiedView: boolean
  isRpaFlow?: boolean
}

export function extractDocumentData(document: TDocumentDetailResponse): TDocumentData {
  const { attributes, id: documentId, status, code, storeId: documentStoreId } = document
  const { desc } = getDocTitleAndDesc(document)
  // const description = getAttributeValue(attributes, CONFIG.ATTRIBUTES.DOCUMENT_DESCRIPTION) as string

  const name =
    (getAttributeValueWithMatchNameAndContext(
      attributes,
      CONFIG.ATTRIBUTES.NAME,
      CONFIG.ATTRIBUTES.VISUALIZABLE_ATTRIBUTES_CONTEXT,
      'value'
    ) as string) ?? (getAttributeValue(attributes, CONFIG.ATTRIBUTES.NAME) as string)
  const tileName = getAttributeValue(attributes, CONFIG.ATTRIBUTES.TILE_NAME) as string
  const storageType = getAttributeValue(attributes, CONFIG.ATTRIBUTES.STORAGE_TYPE) as string
  const attachmentAlreadyArchived = storageType === CONFIG.STORAGE_TYPE.LONG_TERM

  const longTermIdAttrValue = getAttributeValueFromContext(
    document.attributes,
    CONFIG.ATTRIBUTES.ARCHIVE_STORE
  ) as string
  const longTermStoreId = encodeURIComponent(longTermIdAttrValue)
  const storeId = attachmentAlreadyArchived ? longTermStoreId : documentStoreId

  return {
    documentId,
    storeId,
    status,
    code,
    name,
    tileName,
    description: desc as string,
    storageType
  }
}

export default function toDocumentListInitMapper(
  dossierDetailsData: TDossierDetailResponse
): TDocumentListInit | undefined {
  const isRpaFlow = Boolean(dossierDetailsData.attributes.find((attr) => attr.name === ATTRIBUTES.RPA_FLOW)?.value)
  const currentDocumentGroup = dossierDetailsData.documentGroups[0]

  if (isNotBlankEmpty(currentDocumentGroup)) {
    const { attributes, documents } = currentDocumentGroup
    const simplifiedSignAttributeValue = attributes?.find((attr) => attr.name === ATTRIBUTES.SIMPLIFIED_SIGN_ATTR)
      ?.value
    const documentList = documents?.map((document) => extractDocumentData(document))
    return { documents: documentList, isSimplifiedView: Boolean(simplifiedSignAttributeValue), isRpaFlow }
  } else {
    triggerErrorPageNavigation({
      name: ERROR_NAMES.NOT_FOUND,
      message: 'No document group has been found the given group key and dossier id.',
      groupKey,
      dxsDossierId,
      dispatch
    })
  }
}
