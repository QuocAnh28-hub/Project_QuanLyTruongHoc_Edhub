export interface MsGraphAccessTokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  expires_on?: number;
  ext_expires_in: number;
}

export interface MsGraphEmailMessagePayload {
  message: MsGraphEmailMessage;
  saveToSentItems: boolean;
}

export interface MsGraphEmailMessage {
  subject: string;
  body: {
    contentType: string;
    content: string;
  };
  toRecipients: MsGraphEmailMessageRecipient[];
  ccRecipients?: MsGraphEmailMessageRecipient[];
}

export interface MsGraphEmailMessageRecipient {
  emailAddress: {
    address: string;
  };
}

export class MsGraphEmailSendError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}