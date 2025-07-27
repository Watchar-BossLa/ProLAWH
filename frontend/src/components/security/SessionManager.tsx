
// Re-export all session management functionality
export { useSessionManager } from './session/hooks/useSessionManager';
export { SessionService } from './session/services/sessionService';
export { generateDeviceId, getDeviceInfo } from './session/utils/deviceFingerprint';
export type { DeviceSession, DeviceInfo } from './session/types';
