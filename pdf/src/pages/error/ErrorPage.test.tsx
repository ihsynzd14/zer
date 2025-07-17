import { type TErrorResponseState } from '@dxs/coreenablers-fe-common-library'
import { useRouteError } from 'react-router-dom'
import { useAppSelector } from 'src/data/stores/hooks'
import ErrorPage from './ErrorPage'
import React from 'react'
import { render } from '@testing-library/react'

jest.mock('react-router-dom', () => ({
  useRouteError: jest.fn()
}))

jest.mock('src/data/stores/hooks', () => ({
  useAppSelector: jest.fn()
}))
jest.mock('@dxs/coreenablers-fe-common-library', () => ({
  ERROR_NAMES: {
    TECHNICAL_ERROR: 'TECHNICAL_ERROR'
  },
  isNotBlankEmpty: jest.fn(
    (value) => value !== null && value !== undefined && value !== '' && Object.keys(value).length > 0
  ),
  isNotNullOrUndefined: jest.fn((value) => value !== null && value !== undefined),
  isNullOrUndefined: jest.fn((value) => value === null || value === undefined),
  getDynatraceActionName: jest.fn(() => 'action name'),
  ErrorView: jest.fn(() => <div className="test-ErrorView"></div>),
  DxsError: class {
    name: string
    message: string
    details: string
    constructor(name?: string, message?: string, details?: string) {
      this.name = 'TECHNICAL_ERROR'
      this.message = 'message mock'
      this.details = 'details mock'
    }
  }
}))
describe('Error Page', () => {
  const mockErrorResponse: TErrorResponseState = {
    name: 'TECHNICAL_ERROR',
    message: 'message string',
    status: 1,
    contextId: '123',
    errorCode: 'mockErrorCode',
    path: 'path1',
    timestamp: 'mocktimestamp',
    title: 'mock title',
    details: 'mockdetails',
    customErrorNotification: 'mock customError',
    forceShowErrorPage: false
  }
  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    ;(useAppSelector as jest.Mock).mockImplementation(() => mockErrorResponse)
    ;(useRouteError as jest.Mock).mockReturnValue(mockErrorResponse)
  })

  it('renders the component', () => {
    const { container } = render(<ErrorPage />)

    expect(container.firstChild).toHaveClass('test-ErrorView')
  })
  it('checks the getErrorMessage different cases: error empty', () => {
    ;(useAppSelector as jest.Mock).mockImplementation(() => {})
    ;(useRouteError as jest.Mock).mockReturnValue({})
    const { container } = render(<ErrorPage />)

    expect(container.firstChild).toHaveClass('test-ErrorView')
  })
})
