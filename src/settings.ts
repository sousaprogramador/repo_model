require('dotenv/config');

export const PORT = Number(process.env.PORT) || 3333;

export const NODE_ENV = (process.env.NODE_ENV || 'development').trim();
export const VERSION = (process.env.VERSION || 'dev').trim();
export const DATABASE_HOST = process.env.TYPEORM_HOST || 'database';
export const DATABASE_PORT = process.env.TYPEORM_PORT || 3306;
export const DATABASE_USER = process.env.TYPEORM_USERNAME || 'docker';
export const DATABASE_PASSWORD = process.env.TYPEORM_PASSWORD || '123mudar';
export const DATABASE_DB = process.env.TYPEORM_DATABASE || 'pinguim';

export const IS_DEV = NODE_ENV !== 'production' && NODE_ENV !== 'test';
export const IS_PROD = NODE_ENV === 'production';
export const IS_TEST = NODE_ENV === 'test';

export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';

export const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION || '';
export const BUCKET_NAME = process.env.BUCKET_NAME || '';

export const CHAT_KEY = process.env.CHAT_KEY || '';
export const CHAT_SECRET = process.env.CHAT_SECRET || '';

export const jwtConstants = {
  secret: process.env.JWT_TOKEN || 'anytoken'
};
export const ONESIGNAL = {
  APP_ID: process.env.ONESIGNAL_APP_ID,
  ENDPOINT_API: process.env.ONESIGNAL_ENDPOINT
};

export const FRONT_ADMIN_URL = process.env.FRONT_ADMIN_URL || 'http://localhost:3000';
export const FRONT_WEB_URL = process.env.FRONT_WEB_URL || 'https://pinguim.tur.br';
export const API_URL = process.env.API_URL || 'http://localhost:3333';

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '';
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || '';
export const FACEBOOK_OAUTH_URL = process.env.FACEBOOK_OAUTH_URL || 'https://graph.facebook.com/';

export const GOOGLE_OAUTH_URL = process.env.OAUTH2 || 'https://oauth2.googleapis.com/';

export const APPLE_ID_KEYS_URL = process.env.APPLE_ID_KEYS_URL || 'https://appleid.apple.com/auth/keys';

export class RDSTATION {
  static readonly CONVERSIONS_URL = process.env.RD_STATION_CONVERSIONS_URL || '';
  static readonly API_KEY = process.env.RD_STATION_API_KEY || '';
  static readonly BASE_URL = process.env.RD_STATION_BASE_URL || '';
  static readonly CLIENT_ID = process.env.RD_STATION_CLIENT_ID || '';
  static readonly CLIENT_SECRET = process.env.RD_STATION_CLIENT_SECRET || '';
  static readonly REFRESH_TOKEN = process.env.RD_STATION_REFRESH_TOKEN || '';
  static readonly CODE = process.env.RD_STATION_CODE || '';
}

export class MAIL {
  static readonly HOST = process.env.MAIL_HOST;
  static readonly USER = process.env.MAIL_USER;
  static readonly PASS = process.env.MAIL_PASS;
  static readonly TO = process.env.MAIL_TO;
  static readonly FROM = process.env.MAIL_FROM;
  static readonly PORT = Number(process.env.SMTP_PORT);
}

export class FEATFLAGS {
  static readonly LOGIN_NEEDS_EMAIL_CONFIRMATION = process.env.LOGIN_NEEDS_EMAIL_CONFIRMATION || false;
}
