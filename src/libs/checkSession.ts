import { getIronSession } from "iron-session";
// import cookie from "cookie";
import { sessionOptions, SessionData, defaultSession } from "@/libs/session";
import { GetServerSideProps } from "next";
// import { cookies } from "next/headers";

export const getSession = (async (context) => {
  let session = await getIronSession<SessionData>(
    context.req,
    context.res,
    sessionOptions
  );

  if (typeof session.isLoggedIn === "undefined") {
    session = { ...defaultSession, ...session };
  }

  // save session
  await session.save();

  return { props: { session } };
}) satisfies GetServerSideProps<{
  session: SessionData;
}>;

export const checkSession = (async (context) => {
  let session = await getIronSession<SessionData>(
    context.req,
    context.res,
    sessionOptions
  );

  if (!session.isLoggedIn) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // const cookieStore = await cookies();
  // console.log(cookieStore.get("abc"))



//   console.log(session)

//   const cookies = cookie.parse(context.req.headers.cookie || "", {
//   decode: (val) => Buffer.from(decodeURIComponent(val), "base64").toString("utf8"),
// });

  // const myValue = (await cookieStore).get("isMenuCollapse")?.value || "false";

  // const cookieStore = await cookies();
  // const session1 = await getIronSession(cookieStore, sessionOptions);

  // console.log(cookies)


  if (typeof session.isLoggedIn === "undefined") {
    session = { ...defaultSession, ...session };
  }

  // save session
  await session.save();

  return { props: { session } };
}) satisfies GetServerSideProps<{
  session: SessionData;
}>;

export const checkLogin = (async (context) => {
  const session = await getIronSession<SessionData>(
    context.req,
    context.res,
    sessionOptions
  );

  if (session.isLoggedIn) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { session } };
}) satisfies GetServerSideProps<{
  session: SessionData;
}>;
