import { ERROR_NAMES, newError } from '@dxs/coreenablers-fe-common-library'
import { type Dispatch } from 'react'
import type TErrorNameType from '@dxs/coreenablers-fe-common-library/src/data/errors/errorNames.const'
import { type AnyAction } from '@reduxjs/toolkit'

export type TTriggerErrorPageNavigationParams = {
  dispatch: Dispatch<AnyAction>
  message: string
  groupKey: string
  dxsDossierId: string
  name?: TErrorNameType
}

export const triggerErrorPageNavigation = ({
  dispatch,
  message,
  groupKey,
  dxsDossierId,
  name
}: TTriggerErrorPageNavigationParams): void => {
  dispatch(
    newError({
      name: name ?? ERROR_NAMES.TECHNICAL_ERROR,
      message,
      details: `Dossier ID: ${dxsDossierId}
          Group Key ${groupKey}`,
      forceShowErrorPage: true
    })
  )
}
