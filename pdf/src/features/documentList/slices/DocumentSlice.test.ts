import { type TDocumentData } from 'src/data/constants/type'
import { type TDocumentListInit } from '../mapper/documentListInit.mapper'
import {
  documentsSlice,
  setDocumentList,
  selectDocuments,
  selectIsSimplifiedView,
  selectIsRpaFlow
} from './DocumentsSlice'

describe('documentsSlice', () => {
  const initialState: TDocumentListInit = {
    documents: [],
    isSimplifiedView: false,
    isRpaFlow: false
  }

  it('should return the initial state when an empty action is passed', () => {
    const result = documentsSlice.reducer(undefined, { type: '' })
    expect(result).toEqual(initialState)
  })

  it('should set documents using setDocumentList action', () => {
    const mockDocuments: TDocumentData[] = [
      {
        documentId: '1',
        storeId: '100',
        status: 'COMPLETED',
        code: 'DOC001',
        name: 'Test Document 1',
        tileName: 'test1.pdf',
        description: 'Description for Test Document 1',
        storageType: 'cloud'
      },
      {
        documentId: '2',
        storeId: '101',
        status: 'PENDING',
        code: 'DOC002',
        name: 'Test Document 2',
        tileName: 'test2.pdf',
        description: 'Description for Test Document 2',
        storageType: 'local'
      }
    ]

    const finalDocuments: TDocumentListInit = {
      documents: mockDocuments,
      isSimplifiedView: false
    }

    const action = setDocumentList(finalDocuments)

    const result = documentsSlice.reducer(initialState, action)

    expect(result.documents).toEqual(mockDocuments)
  })

  it('should select documents from the state', () => {
    const state = {
      documentsSlice: {
        documents: [
          {
            documentId: '1',
            storeId: '100',
            status: 'COMPLETED',
            code: 'DOC001',
            name: 'Test Document 1',
            tileName: 'test1.pdf',
            description: 'Description for Test Document 1',
            storageType: 'cloud'
          },
          {
            documentId: '2',
            storeId: '101',
            status: 'PENDING',
            code: 'DOC002',
            name: 'Test Document 2',
            tileName: 'test2.pdf',
            description: 'Description for Test Document 2',
            storageType: 'local'
          }
        ],
        isSimplifiedView: false
      }
    }

    const result = selectDocuments(state)
    expect(result).toEqual(state.documentsSlice.documents)
  })

  it('should select isSimplifiedView from the state', () => {
    const state = {
      documentsSlice: {
        documents: [],
        isSimplifiedView: true,
        isRpaFlow: false
      }
    }

    const result = selectIsSimplifiedView(state)
    expect(result).toEqual(true)
  })
  it('should select isRpaFlow from the state', () => {
    const state = {
      documentsSlice: {
        documents: [],
        isSimplifiedView: true,
        isRpaFlow: true
      }
    }

    const result = selectIsRpaFlow(state)
    expect(result).toEqual(true)
  })
})
