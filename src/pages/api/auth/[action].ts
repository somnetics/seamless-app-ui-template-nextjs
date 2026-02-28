import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/libs/session";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // get session
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  // check request
  if (req.method === "POST" && req.query.action === "login") {
    // call api
    const response = await fetch(`${process.env.NEXT_PUBLIC_SEAMLESS_IDENTITY_HUB_API_HOST}/auth/login`, {
      method: "POST",      
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: req.body.username,
        password: req.body.password,
      })
    });

    // get response data
    const data = await response.json();

    console.log(data);

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

    // const data = {
    //   id: "",
    //   full_name: 'soumen.sardar',
    //   email: 'Soumen Sardar',      
    //   status: 'Soumen Sardar',      
    //   manager: 'Soumen Sardar',      
    //   roles: 'User successfully authenticated',
    //   groups: 'User successfully authenticated',
    //   organization: 'User successfully authenticated',
    //   access_token: "",
    //   refresh_token: ''
    // }

    // handle success
    if (response.status == 200) {
      // set session data        
      session.userid = data.id;
      session.username = data.email;
      session.fullname = data.full_name;
      session.email = data.email;
      session.access_token = data.access_token;
      session.refresh_token = data.refresh_token;
      // session.access = data.access;
      session.isLoggedIn = true;

      // save session
      await session.save();

      // return json
      res.json({ status: "success", message: "User successfully authenticated." });
    } else {
      // return json
      res.json({ status: "error", message: "data.message" });
    }
  } else if (req.method === "POST" && req.query.action === "logout") {
    // destroy destroy
    session.destroy();

    // return json
    res.json({ status: "success", message: "Logout successfully." });
  }
}
