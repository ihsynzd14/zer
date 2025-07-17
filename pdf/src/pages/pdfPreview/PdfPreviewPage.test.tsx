import * as React from 'react'
import { act, render } from '@testing-library/react'
import PdfPreviewPage from './PdfPreviewPage'
import { useAppSelector } from 'src/data/stores/hooks'
import useCallbackEvent from 'src/hooks/useCallbackEvent'
import { selectSessionParams, useFetchPdfPreviewData, useSendPostMessage } from '@dxs/coreenablers-fe-common-library'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFetchPreview } from 'src/hooks/useFetchDocPreview'
import { selectDocuments, selectIsRpaFlow } from 'src/features/documentList/slices/DocumentsSlice'
import { type TAttachmentDetailPageUrlState } from 'src/data/constants/type'

jest.mock('src/data/stores/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn()
}))

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn()
}))

jest.mock('src/hooks/useCallbackEvent', () => jest.fn())

jest.mock('src/hooks/useFetchDocPreview', () => ({
  useFetchPreview: jest.fn()
}))

const mockShowHelpModal = jest.fn()
const mockNavigate = jest.fn()
const mockpdfData = {
  isReconciliateFlow: false,
  shouldHideControls: false,
  fileUrl: 'url',
  fileName: 'mockName',
  mimeType: 'apllication/pdf'
}
const mockfetchDocument = jest.fn((): TAttachmentDetailPageUrlState => mockpdfData)
const mockuseFetchPreview = { fetchDocument: mockfetchDocument }
const mockfetchPdfPreviewData = jest.fn(() => ({
  storeId: '123',
  storageType: 'LONG_TERM',
  callerCode: 'code',
  bankCode: '200'
}))

const mockselectDocuments = [{ storeId: '123', storageType: 'LONG_TERM', description: 'mockDesctiption' }]
describe('Preview Page', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  const mockLocation = { state: { documentId: '123' } }
  beforeEach(() => {
    ;(useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selectSessionParams === selector) {
        return { groupKey: '123', dxsDossierId: '123' }
      } else if (selector === selectDocuments) {
        return mockselectDocuments
      } else if (selector === selectIsRpaFlow) {
        return true
      }
    })
    ;(useCallbackEvent as jest.Mock).mockReturnValue(jest.fn())
    ;(useSendPostMessage as jest.Mock).mockImplementation(() => mockShowHelpModal)
    ;(useNavigate as jest.Mock).mockReturnValue(mockNavigate)
    ;(useLocation as jest.Mock).mockReturnValue(mockLocation)
    ;(useFetchPreview as jest.Mock).mockReturnValue(mockuseFetchPreview)
    ;(useFetchPdfPreviewData as jest.Mock).mockReturnValue(mockfetchPdfPreviewData)
  })

  it('renders the spinner correctly', () => {
    const { container } = render(<PdfPreviewPage />)

    expect(container.firstChild).toHaveClass('uds__spinner__overlay')
  })
  it('renders the component correctly', async () => {
    const { container } = render(<PdfPreviewPage />)
    await act(async () => {
      // Wait for next tick to allow useEffect to run
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    expect(container.firstChild).toHaveClass('navigation-bar-row')
  })
})
