import React from 'react'
import { render } from '@testing-library/react'
import DocumentListView from './DocumentListView'
import { useAppSelector } from 'stores/hooks'
import * as documentsSlice from './slices/DocumentsSlice'

jest.mock('stores/hooks', () => ({
  useAppSelector: jest.fn()
}))

jest.mock('./slices/DocumentsSlice', () => ({
  selectDocuments: jest.fn(),
  selectIsSimplifiedView: jest.fn()
}))

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}))

describe('DocumentListView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders Spinner when documentList is undefined or empty', () => {
    ;(useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === documentsSlice.selectDocuments) {
        return []
      }
      return false
    })

    const { container } = render(<DocumentListView />)

    expect(container?.firstChild).toHaveClass('uds__spinner__overlay')
  })

  it('renders DocumentLink when simplified view is true', () => {
    ;(useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === documentsSlice.selectDocuments) {
        return [{ id: '1', titleName: 'Test Doc', code: 'DOC001' }]
      }
      return selector === documentsSlice.selectIsSimplifiedView
    })

    const { container } = render(<DocumentListView />)

    expect(container?.firstChild?.firstChild).toHaveClass('uds__col')
  })

  it('renders DocumentCard when simplified view is false', () => {
    ;(useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === documentsSlice.selectDocuments) {
        return [{ id: '1', titleName: 'Test Doc', code: 'DOC001' }]
      }
      return selector !== documentsSlice.selectIsSimplifiedView
    })
    const { container } = render(<DocumentListView />)

    expect(container?.firstChild?.firstChild?.firstChild).toHaveClass('uds__card__textButton')
  })
})
