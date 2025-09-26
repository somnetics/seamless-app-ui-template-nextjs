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
    console.log(req.body)

    // set menu state
    if (typeof req.body.menuCollapse !== "undefined") session.isMenuCollapse = req.body.menuCollapse;
    
    // set theme state
    if (typeof req.body.theme !== "undefined") session.theme = req.body.theme;

    // save session
    await session.save();

    // return json
    res.json({ status: "success", message: "Session data udpdated successfully." });
  }
}
