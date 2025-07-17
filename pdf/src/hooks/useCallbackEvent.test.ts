import { useAppSelector } from 'src/data/stores/hooks'
import useCallbackEvent from './useCallbackEvent'
import { renderHook } from '@testing-library/react'
import { isInWorkflow, useSendCallback, useSendPostMessage } from '@dxs/coreenablers-fe-common-library'

jest.mock('src/data/stores/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn()
}))

describe('useCallBackEvent test', () => {
  const mockSessionParams = { dxsDossierId: '1', callerCode: '123', bankCode: '200' }
  const mockSendEventToTarget = { sendEventToTarget: jest.fn() }
  const mockSendCallback = { sendCallback: jest.fn() }
  afterEach(() => {
    jest.clearAllMocks()
  })
  beforeEach(() => {
    ;(useAppSelector as jest.Mock).mockImplementation(() => mockSessionParams)
    ;(useSendPostMessage as jest.Mock).mockImplementation(() => mockSendEventToTarget)
    ;(useSendCallback as jest.Mock).mockImplementation(() => mockSendCallback)
  })

  it('triggercllback', async () => {
    const { result } = renderHook(() => useCallbackEvent())

    const { triggerCallback } = result.current

    triggerCallback()

    expect(typeof triggerCallback).toBe('function')
    expect(useSendPostMessage).toHaveBeenCalled()
  })
  it('triggercllback not in workflow', async () => {
    ;(isInWorkflow as jest.Mock).mockImplementation(() => false)
    const { result } = renderHook(() => useCallbackEvent())

    const { triggerCallback } = result.current

    triggerCallback()

    expect(typeof triggerCallback).toBe('function')
    expect(useSendPostMessage).toHaveBeenCalled()
  })
})
