import React, { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PdfDownloadButton from './PdfDownloadButton'
import { createBlobFromBase64Content } from '@dxs/coreenablers-fe-common-library'

beforeAll(() => {
  global.URL.createObjectURL = jest.fn()
  global.URL.revokeObjectURL = jest.fn()
})

describe('PdfDownloadButton', () => {
  const fileUrl = 'data:application/pdf;base64,JVBERi0xLjQK'
  const fileName = 'test-file'

  it('renders the download button correctly', () => {
    render(<PdfDownloadButton fileName={fileName} fileUrl={fileUrl} />)

    const button = screen.getByTitle('download-button')
    expect(button).toBeInTheDocument()
  })

  it('calls downloadPdf function when button is clicked', () => {
    ;(createBlobFromBase64Content as jest.Mock).mockReturnValue(new Blob())
    render(<PdfDownloadButton fileName={fileName} fileUrl={fileUrl} />)

    const button = screen.getByTitle('download-button')

    act(() => {
      fireEvent.click(button)
    })

    expect(createBlobFromBase64Content).toHaveBeenCalledWith(fileUrl, expect.any(String))
  })
})
