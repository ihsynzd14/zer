import {
  type TDocumentGroupResponse,
  type TAttribute,
  type TDocumentDetailResponse
} from '@dxs/coreenablers-fe-common-library'
import toDocumentListInitMapper, { extractDocumentData, type TDocumentListInit } from './documentListInit.mapper'

const mockAttributes: TAttribute[] = [
  { name: 'DOCUMENT_DESCRIPTION', value: 'This is a document description', context: 'general', type: 'string' },
  { name: 'NAME', value: 'Document Name', context: 'title', type: 'string' },
  { name: 'TILE_NAME', value: 'Document Tile Name', context: 'metadata', type: 'string' },
  { name: 'DOCUMENT_TYPE', value: 'PDF', context: 'type', type: 'string' },
  { name: 'LONG_TERM', value: 'LONG_TERM', context: 'type', type: 'string' }
]

const mockDocumentDetailResponse: TDocumentDetailResponse = {
  id: '1',
  attributes: mockAttributes,
  code: 'DOC123',
  status: 'active',
  type: 'general',
  source: 'internal',
  storeId: 'stored123'
}

describe('extractDocumentData', () => {
  it('should correctly extract and transform data from the document detail response', () => {
    const result = extractDocumentData(mockDocumentDetailResponse)

    expect(result.documentId).toBe(mockDocumentDetailResponse.id)
    expect(result.storeId).toBe(mockDocumentDetailResponse.storeId)
    expect(result.code).toBe(mockDocumentDetailResponse.code)
    expect(result.name).toBe('Document Name')
    expect(result.description).toBe('This is a document description')
    expect(result.storageType).toBe('LONG_TERM')
    expect(result.tileName).toBe('Document Tile Name')
  })

  // it('should return false for isSimplifiedView if SIMPLIFIED_SIGN_ATTR is not present', () => {
  //   const mockDocumentGroup: TDocumentGroupResponse = {
  //     id: 1,
  //     groupKey: 'group1',
  //     status: 'active',
  //     subStatus: null,
  //     creationDate: '2023-01-01',
  //     expirationDate: '2023-12-31',
  //     documents: [mockDocumentDetailResponse],
  //     signers: [
  //       {
  //         attributes: mockAttributes,
  //         accountId: '123',
  //         name: 'name',
  //         ndg: 'ndg',
  //         signChannel: 'signChannel',
  //         signatureDate: null,
  //         type: 'type'
  //       }
  //     ],
  //     attributes: mockAttributes
  //   }

  //   const result: TDocumentListInit = toDocumentListInitMapper({ dossierDetailsData: mockDocumentGroup })

  //   expect(result.documents).toBeDefined()
  //   expect(result.isSimplifiedView).toBe(false)
  // })
})
