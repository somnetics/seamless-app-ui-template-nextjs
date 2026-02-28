import { SessionOptions } from "iron-session";

// id: '019c8f16-7840-71d5-9cb8-caf27365c644',
//   full_name: 'User-001',
//     email: 'user001@techcorp.com',
//       gender: 'MALE',
//         status: 'active',
//           manager: null,
//             roles: [],
//               groups: [],
//                 organization: null,
//                   access_token: 'eyJhbGciOiJIUzM4NCJ9.eyJqdGkiOiIwMTljOGYxNy1mM2M2LTc0MmItOWFhZS0xYmY5MjExMmM3OWEiLCJzdWIiOiIwMTljOGYxNi03ODQwLTcxZDUtOWNiOC1jYWYyNzM2NWM2NDQiLCJpYXQiOjE3NzE5MjcyMzcsImlzcyI6InNlYW1sZXNzNC9pZGVudGl0eS1odWIiLCJleHAiOjE3NzE5Mjc1MzcsIm9yZ2FuaXphdGlvbiI6IiIsInJvbGVzIjpbXSwiZ3JvdXBzIjpbXX0.zgmJsTJWe8LBTZMsiF7-MGVVakOfVKQ4KvRSY3jRVscryPOQJ_o3pJy6zSREe_jG',
//                     refresh_token:

export interface SessionData {
  userid: string;
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
  userid: "guest",
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
