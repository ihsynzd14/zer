import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import DocumentCard from './DocumentCard'
import { type TDocumentData } from 'src/data/constants/type'
import { useNavigate } from 'react-router-dom'
import CONFIG from 'src/data/config'

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}))

const mockDocument: TDocumentData = {
  documentId: '1',
  storeId: '100',
  status: 'Completed',
  code: 'DOC001',
  name: 'Test Document',
  tileName: 'test.pdf',
  description: 'Test document description',
  storageType: 'cloud'
}

describe('DocumentCard', () => {
  it('renders document information correctly', () => {
    render(<DocumentCard document={mockDocument} />)

    expect(screen.getByText('test.pdf')).toBeInTheDocument()
    expect(screen.getByText('Test document description')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('displays correct status', () => {
    render(<DocumentCard document={{ ...mockDocument, status: 'UPLOADED' }} />)

    expect(screen.getByText('DXS_PDFPREVIEW_PDFDOCLIST_ACTIONTEXT')).toBeInTheDocument()
  })

  it('calls navigate function when clicked', () => {
    const mockNavigate = jest.fn()
    ;(useNavigate as jest.Mock).mockReturnValue(mockNavigate)

    render(<DocumentCard document={{ ...mockDocument, status: 'UPLOADED' }} />)

    const cardElement = screen.getByText('DXS_PDFPREVIEW_PDFDOCLIST_ACTIONTEXT')

    act(() => {
      cardElement.click()
    })

    expect(mockNavigate).toHaveBeenCalledWith(`/dxs/${CONFIG.APP_NAME}/pdf-preview`, { state: { documentId: '1' } })
  })

  it('handles missing fileName gracefully', () => {
    const documentWithoutFileName = { ...mockDocument, tileName: null }
    render(<DocumentCard document={documentWithoutFileName} />)

    expect(screen.getByText('Test Document')).toBeInTheDocument()
    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
  })
})
