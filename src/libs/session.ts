import { SessionOptions } from "iron-session";

export interface SessionData {
  username: string;
  fullname: string
  email: string;  
  access_token?: string;
  refresh_token?: string;  
  access?: any;
  theme: string;  
  isMenuCollapse: string;  
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  username: "guest",
  fullname: "Guest",
  email: "",  
  theme: "light",
  isMenuCollapse: "false",  
  isLoggedIn: false
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASS as string,
  cookieName: process.env.SESSION_NAME as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    maxAge: Number(process.env.SESSION_TIMEOUT), // 30 mins
    path: "/",
  },
};
