import { getIronSession } from "iron-session";
import { sessionOptions, SessionData, defaultSession } from "@/libs/session";
import { GetServerSideProps } from "next";

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
