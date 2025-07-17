import { renderHook } from '@testing-library/react'
import { useFetchPreview } from './useFetchDocPreview'
import { useFetchPdfPreviewData } from '@dxs/coreenablers-fe-common-library'
import { useAppSelector } from 'src/data/stores/hooks'
import { type TAttachmentDetailPageUrlState } from 'src/data/constants/type'

jest.mock('src/data/stores/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn()
}))

describe('useFetchDocPreview test', () => {
  const mockfetchPdfPreview = {
    fetchPdfPreviewByStoreId: jest.fn(() => 'value returned')
  }
  const mockPdfData: TAttachmentDetailPageUrlState = {
    fileName: 'filename',
    fileUrl: 'fileUrl',
    mimeType: 'application/pdf'
  }
  const mockfetchPdfPreviewWithValues = {
    fetchPdfPreviewByStoreId: jest.fn(() => mockPdfData)
  }

  const mockSessionParams = { callerCode: '1', bankCode: '200' }
  afterEach(() => {
    jest.clearAllMocks()
  })
  beforeEach(() => {
    ;(useAppSelector as jest.Mock).mockImplementation(() => mockSessionParams)
    ;(useFetchPdfPreviewData as jest.Mock).mockImplementation(() => mockfetchPdfPreview)
  })

  it('document data null', async () => {
    const { result } = renderHook(() => useFetchPreview())

    const { fetchDocument } = result.current

    const documentData = await fetchDocument({ storeId: '1', storageType: 'LONG_TERM' })
    expect(typeof result.current.fetchDocument).toBe('function')
    expect(documentData).toBeNull()
  })
  it('document data not null', async () => {
    ;(useFetchPdfPreviewData as jest.Mock).mockImplementation(() => mockfetchPdfPreviewWithValues)
    const { result } = renderHook(() => useFetchPreview())

    const { fetchDocument } = result.current

    const documentData = await fetchDocument({ storeId: '1', storageType: 'LONG_TERM' })
    // await jest.runAllTimersAsync()
    expect(typeof result.current.fetchDocument).toBe('function')
    expect(documentData).not.toBeNull()
  })
})
