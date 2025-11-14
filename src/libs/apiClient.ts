import { EventEmitter } from "events";
import { SessionData } from "@/libs/session";

// init event emitter
export const sessionEvents = new EventEmitter();

// extent fetch options
interface FetchOptions extends RequestInit {
  auth?: boolean; // whether to include Authorization header
}

// refresh access token
const refreshAccessToken = async (session: SessionData): Promise<any | null> => {
  // get refresh token from session
  const refreshToken = session.refresh_token;

  // if no refresh token found return
  if (!refreshToken) return null;

  // call api
  const response = await fetch("/api/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  // get response data
  const token = await response.json();

  // update access token
  session.access_token = token.access_token;

  // update refresh token
  session.refresh_token = token.refresh_token;

  // return token
  return token;
};

export async function apiFetch<T = any>(
  session: SessionData,
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  // get headers
  const headers = new Headers(options.headers || {});

  // if auth
  if (options.auth !== false) {
    // get token
    const token = session.access_token;

    // set bearer token to header
    if (token) {
      headers.set("Authorization", `Bearer ${session.access_token}`);
      headers.set("client_id", process.env.NEXT_PUBLIC_SEAMLESS_AUTH_API_CLIENT_ID as string);
      headers.set("client_secret", process.env.NEXT_PUBLIC_SEAMLESS_AUTH_API_CLIENT_SECRET as string);
    }
  }

  // extent fetch options
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    // cache: "no-store"
  };

  // get response
  let response = await fetch(url, fetchOptions);

  // If unauthorized, try refresh
  if (response.status === 401 && options.auth !== false) {
    // get new refresh token
    const token = await refreshAccessToken(session);

    // if new token 
    if (token.access_token) {
      // set the new bearer token to header
      headers.set("Authorization", `Bearer ${token.access_token}`);

      // get response
      response = await fetch(url, { ...fetchOptions, headers });
    } else {
      // set session event
      sessionEvents.emit("sessionExpired");

      // throw error
      throw new Error("Session expired. Please log in again.");
    }
  }

  // if error in response
  if (!response.ok) {
    // get the response
    const text = await response.text();

    // throw error
    throw new Error(`API Error ${response.status}: ${text}`);
  }

  // finaly return json
  return response.json();
}
