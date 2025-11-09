import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

export interface User {
  id: string;
  name: string;
  avatar?: string;
  innitails?: string;
  color?: string;
  status?: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface WorkPackages {
  id: string;
  parent: string;
  name: string;
  type: string;
  href: string;
}

// const GlobalStateContext = createContext();
type GlobalStateContextType = {
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;

  isMainMenuOpen: string | undefined;
  setToogleMainMenu: Dispatch<SetStateAction<string | undefined>>;
  saveMenuStateToSession: (state: string) => Promise<void>;

  theme: string | undefined;
  setTheme: Dispatch<SetStateAction<string | undefined>>;
  saveThemeToSession: (theme: string) => Promise<void>;

  saveDataToSession: (data: any) => Promise<void>;
  registerSSE: (endpoint: string) => void;
  eventData: any;
};

// get global state content
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

// export use global state method
export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

// export global state provider
export const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | undefined>();
  const [isMainMenuOpen, setToogleMainMenu] = useState<string>();
  const [theme, setTheme] = useState<string>();
  const [eventData, setEventData] = useState<any>();

  const saveDataToSession = async (data: any) => {
    // call api
    const response = await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // get response data
    await response.json();
  };

  const saveMenuStateToSession = async (state: string) => {
    // save data to session
    await saveDataToSession({ menuCollapse: state });

    // store menu state to local storage
    localStorage.setItem("isMenuCollapse", state);

    // set user
    setToogleMainMenu(state);
  };

  const saveThemeToSession = async (theme: string) => {
    // save data to session
    await saveDataToSession({ theme: theme });

    // set user
    setTheme(theme);
  };

  const registerSSE = (endpoint: string) => {
    const evtSource = new EventSource(endpoint);

    evtSource.onmessage = (e) => {
      try {
        // on data
        const data = JSON.parse(e.data);

        // set event data
        setEventData(data);
      } catch (err) {
        console.error("Invalid SSE data:", err);
      }
    };

    evtSource.onerror = (err) => {
      console.error("SSE error:", err);
      evtSource.close();
    };

    return () => {
      evtSource.close();
    };
  };

  return (
    <GlobalStateContext.Provider
      value={{
        users,
        setUsers,
        user,
        setUser,
        isMainMenuOpen,
        setToogleMainMenu,
        saveMenuStateToSession,
        theme,
        setTheme,
        saveThemeToSession,
        saveDataToSession,        
        eventData,
        registerSSE,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
