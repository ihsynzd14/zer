import React, { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DocumentLink from './DocumentLink'
import { useNavigate } from 'react-router-dom'
import { type TDocumentData } from 'src/data/constants/type'
import ROUTES from 'src/data/routes/routes.const'

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}))

describe('DocumentLink', () => {
  const mockDocument: TDocumentData = {
    documentId: '1',
    storeId: '100',
    status: 'COMPLETED',
    code: 'DOC001',
    name: 'Test Document',
    tileName: 'test.pdf',
    description: 'Test document description',
    storageType: 'cloud'
  }

  it('renders document information correctly', () => {
    render(<DocumentLink document={mockDocument} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('test.pdf')
    expect(button).toHaveAttribute('title', 'test.pdf')
  })

  it('displays name when tileName is null', () => {
    const docWithoutTileName = { ...mockDocument, tileName: null }
    render(<DocumentLink document={docWithoutTileName} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Test Document')
    expect(button).toHaveAttribute('title', 'Test Document')
  })

  it('calls navigate function when clicked', () => {
    const mockNavigate = jest.fn()
    ;(useNavigate as jest.Mock).mockReturnValue(mockNavigate)

    render(<DocumentLink document={mockDocument} />)

    const button = screen.getByRole('button')

    act(() => {
      fireEvent.click(button)
    })

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PDF_PREVIEW, { state: { documentId: '1' } })
  })
})
