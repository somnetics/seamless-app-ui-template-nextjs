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
  if (req.method === "POST") {
    // set menu state
    if (typeof req.body.menuCollapse !== "undefined") session.isMenuCollapse = req.body.menuCollapse;

    // set theme state
    if (typeof req.body.theme !== "undefined") session.theme = req.body.theme;

    // get refresh token
    const refresh_token = session.refresh_token || req.body.refresh_token;

    // if refresh token is not requested
    if (typeof refresh_token !== "undefined") {
      // request for new refresh token    
      const response = await fetch(`${process.env.NEXT_PUBLIC_SEAMLESS_AUTH_API_HOST}/auth/get-refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh_token }),
      });

      // throw error
      if (response.ok) {
        // get json response 
        const data = await response.json();

        // set access token
        session.access_token = data.access_token;

        // set refresh token
        session.refresh_token = data.refresh_token;
      }
    }

    // save session
    await session.save();

    // return json
    res.json({ status: "success", message: "Session data udpdated successfully.", access_token: session.access_token, refresh_token: session.refresh_token });
  }
}
