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
    // set proejct id
    if (req.body.project) session.project = req.body.project;

    // set user id
    if (req.body.user) session.user = req.body.user;

    // set panel collapse
    if (req.body.panelCollapse) session.panelCollapse = req.body.panelCollapse;

    // save session
    await session.save();

    // return json
    res.json({ status: "success", message: "Session data udpdated successfully." });
  }
}
