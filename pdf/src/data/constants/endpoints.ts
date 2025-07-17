import { COMMON_ENDPOINT_NAMES } from '@dxs/coreenablers-fe-common-library'

/**
 * @description This class contains all the endpoint names used in the application.
 * The ENDPOINTS class extends the COMMON_ENDPOINT_NAMES class and adds additional name values specific to the application.
 */
export default abstract class ENDPOINTS extends COMMON_ENDPOINT_NAMES {
  static readonly PROMOTE_ARCHIVE_TO_SIGN = 'dossiers'
}
