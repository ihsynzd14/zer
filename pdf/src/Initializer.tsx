import React, { type ReactElement } from 'react'
import { Provider } from 'react-redux'
import store from 'stores/store'
import App from 'src/App'
import { DynatraceTracker, initializeIAL } from '@dxs/coreenablers-fe-common-library'
import { Dynatrace } from '@omn/react-ark-library'

export type TInitializerProps = {
  additionalData?: string[]
  appAsComponent?: boolean
  dxsSessionId?: string
}

initializeIAL()

export default function Initializer(props: TInitializerProps): ReactElement {
  console.log('PROPS in INITIALIZER PDF GLOBAL', props)

  return (
    <Provider store={store}>
      <DynatraceTracker Dynatrace={Dynatrace} />
      <App {...props} />
    </Provider>
  )
}
