import { Payload } from "./src/interface/GeneralInterface";

export type QueryEvent = {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
};

export interface Error {
  name: string;
  message: string;
  stack?: string;
  errors: { field: string; message: string }[] | null;
}

declare global {
  namespace Express {
    interface Request {
      payload:Payload,
      account: {
        loginId:string;
        email: string;
        role: string; 
      }
    }
  }
}
