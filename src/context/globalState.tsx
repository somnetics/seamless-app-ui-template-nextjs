import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

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
  isMainMenuOpen: boolean;
  setToogleMainMenu: Dispatch<SetStateAction<boolean>>;
  savePanelSateToSession: (state: boolean) => Promise<void>;
  saveUserToSession: (option: Project) => Promise<void>;  
  registerSSE: (endpoint: string) => void;
  eventData: any;
};

// get global state content
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

// export use global state method
export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}

// export global state provider
export const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | undefined>(); 
  const [isMainMenuOpen, setToogleMainMenu] = useState<boolean>(true);
  const [eventData, setEventData] = useState<any>();

  const saveUserToSession = async (option: any) => {
    // call api
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: option })
    });

    // get response data
    await response.json();

    // set user
    setUser(option);
  }

  const savePanelSateToSession = async (state: boolean) => {
    // call api
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ panelCollapse: state })
    });

    // get response data
    await response.json();

    // set user
    setToogleMainMenu(state);
  }

  const registerSSE = (endpoint: string) => {
    const evtSource = new EventSource(endpoint);

    evtSource.onmessage = (e) => {
      try {
        // on data
        const data = JSON.parse(e.data);

        // set event data
        setEventData(data);
      } catch (err) {
        console.error('Invalid SSE data:', err);
      }
    };

    evtSource.onerror = (err) => {
      console.error('SSE error:', err);
      evtSource.close();
    };

    return () => {
      evtSource.close();
    };
  }

  return (
    <GlobalStateContext.Provider value={{
      users,
      setUsers,
      user,
      setUser,     
      isMainMenuOpen,
      setToogleMainMenu,
      savePanelSateToSession,
      saveUserToSession,      
      eventData,
      registerSSE
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
