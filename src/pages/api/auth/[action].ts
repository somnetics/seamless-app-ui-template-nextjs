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
    const response = await fetch(`${process.env.NEXT_PUBLIC_SEAMLESS_AUTH_API_HOST}/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_SEAMLESS_AUTH_API_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_SEAMLESS_AUTH_API_CLIENT_SECRET,
        username: req.body.username,
        password: req.body.password,
      })
    });

    // get response data
    const data = await response.json();

    // handle success
    if (data.status == 200) {
      // set session data        
      session.username = data.username;
      session.fullname = data.fullname;
      session.email = data.email;
      session.access_token = data.access_token;
      session.refresh_token = data.refresh_token;
      session.access = data.access;
      session.isLoggedIn = true;

      // save session
      await session.save();

      // return json
      res.json({ status: "success", message: "User successfully authenticated." });
    } else {
      // return json
      res.json({ status: "error", message: data.message });
    }
  } else if (req.method === "POST" && req.query.action === "logout") {
    // destroy destroy
    session.destroy();

    // return json
    res.json({ status: "success", message: "Logout successfully." });
  }
}
