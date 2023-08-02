interface Config{
    PORT: string;
    ALLOWEDORIGIN: string[];
    SALT: number;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_DURATION: string;
    REFRESH_TOKEN_DURATION: string;
    AUTHH_TOKEN_TYPE_NAME: string;
    AUTH_REFRESH_TOKEN_NAME: string;
    REFRESH_TOKEN_MAXAGE: number
}
export default Config