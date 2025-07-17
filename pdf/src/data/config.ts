import { COMMON_CONFIG } from '@dxs/coreenablers-fe-common-library'

/**
 * This class is used to store all the configuration values used by the application.
 */

export default abstract class CONFIG extends COMMON_CONFIG {
  static readonly ATTRIBUTES = {
    ...COMMON_CONFIG.ATTRIBUTES,
    SIMPLIFIED_SIGN_ATTR: 'simplifiedSign',
    VISUALIZABLE_ATTRIBUTES_CONTEXT: 'visualizableAttributes',
    RPA_FLOW: 'rpaFlow'
  }

  static readonly WORKFLOW_EVENT = {
    ...COMMON_CONFIG.WORKFLOW_EVENT,
    BACK_EVENT_FOR_WF: 'FE_DXS_PREVIEW_DOCUMENT_BACK'
  }

  static readonly MFEBUS_EVENT = {
    SHOW_MODAL: 'showHelpModal',
    SESSION_PARAM_MFEBUS: 'mfeBus'
  }

  static readonly DOM_EVENT = {
    CLOSE: 'pdfPreview-close',
    ERROR: 'technical-error',
    SKIP: 'pdfPreview-skip',
    REJECT: 'pdfPreview-reject'
  }

  static readonly CHIOSK_CHANNELS = {
    CHANNELS: ['58', '87']
  }

  static readonly DOC_STATUS = {
    COMPLETED: 'Completed'
  }

  static readonly WIZARD_FE_NAME = 'enterprise-wizard-fe-global'
}
