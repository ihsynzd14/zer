import { render } from '@testing-library/react'
import React from 'react'
import DocumentListPage from './DocumentListPage'
import { useAppSelector } from 'src/data/stores/hooks'
import useCallbackEvent from 'src/hooks/useCallbackEvent'
import { useSendPostMessage, useWorkflowInstances } from '@dxs/coreenablers-fe-common-library'
jest.mock('src/data/stores/hooks', () => ({
  useAppSelector: jest.fn()
}))

jest.mock('src/hooks/useCallbackEvent', () => jest.fn())

describe('DocumentListPage', () => {
  const mockShowHelpModal = jest.fn()
  beforeEach(() => {
    ;(useAppSelector as jest.Mock).mockReturnValue({ isWorkflow: false, showBackButton: true })
    ;(useCallbackEvent as jest.Mock).mockReturnValue(jest.fn())
    ;(useWorkflowInstances as jest.Mock).mockReturnValue({ backWorkflow: jest.fn() })
    ;(useSendPostMessage as jest.Mock).mockImplementation(() => mockShowHelpModal)
  })

  it('renders the component correctly', () => {
    const { container } = render(<DocumentListPage />)
    expect(container.firstChild).toHaveClass('navigation-bar-row')
    expect(container.children[1]).toHaveClass('document-title-subtitle')
    expect(container.children[2]).toHaveClass('uds__spinner__overlay')
    expect(container.children[2]).toHaveClass('uds__spinner__overlay')
    expect(container.children[3].firstChild).toHaveClass('coreenablers-flex-end-position')
  })
})
