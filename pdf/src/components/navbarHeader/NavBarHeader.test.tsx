import React, { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import NavBarHeader from './NavBarHeader' // Assicurati che il percorso dell'import sia corretto
import { useAppSelector } from 'src/data/stores/hooks'
import { useSendPostMessage } from '@dxs/coreenablers-fe-common-library'

jest.mock('src/data/stores/hooks', () => ({
  useAppSelector: jest.fn()
}))

describe('NavBarHeader', () => {
  const mockCloseFunc = jest.fn()
  const mockShowHelpModal = jest.fn()
  const mockBackButtonFunc = jest.fn()

  beforeEach(() => {
    ;(useAppSelector as jest.Mock).mockReturnValue('mockedSessionId')
    ;(useSendPostMessage as jest.Mock).mockImplementation(() => mockShowHelpModal)
  })

  it('renders the component correctly', () => {
    render(
      <NavBarHeader
        closeIconFunc={mockCloseFunc}
        showHelp
        showCloseButton
        backButtonFunc={mockBackButtonFunc}
        showBackButton={true}
      />
    )
    const helpButton = screen.getByTestId('help-button')
    expect(helpButton).toBeInTheDocument()

    const closeButton = screen.getByTestId('navigation-close-button')
    expect(closeButton).toBeInTheDocument()
  })

  it('calls closeFunc when close button is clicked', () => {
    render(
      <NavBarHeader
        closeIconFunc={mockCloseFunc}
        showHelp
        showCloseButton
        backButtonFunc={mockBackButtonFunc}
        showBackButton={true}
      />
    )

    const closeButton = screen.getByTestId('navigation-close-button')
    act(() => {
      fireEvent.click(closeButton)
    })

    expect(mockCloseFunc).toHaveBeenCalled()
  })

  it('calls backButtonFunc when back button is clicked', () => {
    render(
      <NavBarHeader
        closeIconFunc={mockCloseFunc} // Nome corretto della prop
        showHelp={true} // Nome corretto della prop
        backButtonFunc={mockBackButtonFunc}
        showBackButton={true}
      />
    )

    const backButton = screen.getByTestId('navigation-back-button')
    act(() => {
      fireEvent.click(backButton)
    })

    expect(mockBackButtonFunc).toHaveBeenCalled()
  })
})
