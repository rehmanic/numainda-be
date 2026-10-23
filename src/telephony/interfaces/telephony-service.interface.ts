export interface TelephonyToken {
  provider: string;
  token: string;
  callerId: string;
  expiresIn?: number;
}

export interface ITelephonyService {
  getClientToken(userId?: string): Promise<TelephonyToken>;
  handleWebhook(payload: unknown, headers?: Record<string, string>): Promise<void>;
  getCallerId(): Promise<string>;
}

export const TELEPHONY_SERVICE = 'TELEPHONY_SERVICE';
