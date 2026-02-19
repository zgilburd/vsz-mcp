export type {
  VszMcpConfig,
  VszEdition,
} from './config.js';
export { EDITION_DEFAULTS, CONFIG_DEFAULTS, resolveConfig, loadConfigFromEnv } from './config.js';

export type {
  ListResponse,
  CreateResponse,
  PaginatedResponse,
  QueryRequest,
  QueryFilter,
  FullTextSearch,
  SortInfo,
  GetListPaginationParams,
  PostQueryPaginationParams,
} from './api-responses.js';

export type {
  Zone,
  AccessPoint,
  GpsCoordinates,
  Wlan,
  WlanVlan,
  WlanGroup,
  WirelessClient,
  WiredClient,
  Domain,
  Alarm,
  Event,
  ApGroup,
  IdentityUser,
  GuestPass,
  Certificate,
  DhcpPool,
} from './domain-objects.js';

export type {
  VszErrorFormatA,
  VszErrorFormatB,
  VszError,
  McpErrorCode,
} from './errors.js';
export {
  parseVszError,
  RUCKUS_ERROR_MAP,
  mapRuckusError,
  isSessionExpiredError,
  isRetryableError,
} from './errors.js';

export type {
  ServiceTicketAuth,
  SessionAuth,
  SessionInfo,
  AuthState,
  AuthManager,
  RequestConfig,
} from './auth.js';
