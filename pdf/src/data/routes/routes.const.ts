import { COMMON_ROUTES } from '@dxs/coreenablers-fe-common-library'
import CONFIG from 'data/config'

/**
 * The ROUTES class extends the COMMON_ROUTES class to add additional routes specific to the application.
 */
export default abstract class ROUTES extends COMMON_ROUTES {
  static readonly MAIN_PAGE = this.APP
  static readonly DOCUMENT_LIST = `/dxs/${CONFIG.APP_NAME}/pdf-preview-list`
  static readonly PDF_PREVIEW = `/dxs/${CONFIG.APP_NAME}/pdf-preview`
}
