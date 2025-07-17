import React from 'react'
import { render, screen } from '@testing-library/react'
import TitleAndSubTitle from './TitleAndSubTitle'
import * as hooks from 'src/data/stores/hooks'

jest.mock('src/data/stores/hooks', () => ({
  useAppSelector: jest.fn()
}))

describe('TitleAndSubTitle', () => {
  it('renders title when hideTitle is false', () => {
    jest.spyOn(hooks, 'useAppSelector').mockReturnValue({ hideTitle: false })

    render(<TitleAndSubTitle />)

    expect(screen.getByText('DXS_PDFPREVIEW_PDFLISTPAGE_TITLE_TEXT')).toBeInTheDocument()
  })

  it('does not render title when hideTitle is true', () => {
    jest.spyOn(hooks, 'useAppSelector').mockReturnValue({ hideTitle: true })

    render(<TitleAndSubTitle />)

    expect(screen.queryByText('DXS_PDFPREVIEW_PDFLISTPAGE_TITLE_TEXT')).not.toBeInTheDocument()
  })

  it('always renders subtitle', () => {
    jest.spyOn(hooks, 'useAppSelector').mockReturnValue({ hideTitle: false })

    render(<TitleAndSubTitle />)

    expect(screen.getByText('DXS_PDFPREVIEW_PDFLISTPAGE_SUB_TITLE_TEXT')).toBeInTheDocument()
  })

  it('applies correct classes and styles', () => {
    jest.spyOn(hooks, 'useAppSelector').mockReturnValue({ hideTitle: false })

    render(<TitleAndSubTitle />)

    expect(document.querySelector('.document-title-subtitle')).toBeInTheDocument()
    expect(document.querySelector('.documentList-title')).toBeInTheDocument()
    expect(document.querySelector('.documentList-subTitle')).toBeInTheDocument()

    const title = screen.getByText('DXS_PDFPREVIEW_PDFLISTPAGE_TITLE_TEXT')
    expect(title).toHaveStyle('textTransform: none')

    const subtitle = screen.getByText('DXS_PDFPREVIEW_PDFLISTPAGE_SUB_TITLE_TEXT')
    expect(subtitle).toHaveStyle('textTransform: none')
  })

  it('renders title when hideTitle is undefined ', () => {
    jest.spyOn(hooks, 'useAppSelector').mockReturnValue({ hideTitle: undefined })
    render(<TitleAndSubTitle />)
    expect(screen.getByText('DXS_PDFPREVIEW_PDFLISTPAGE_TITLE_TEXT')).toBeInTheDocument()
  })
})
