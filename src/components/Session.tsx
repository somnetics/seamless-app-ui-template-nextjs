import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Button from '@/components/Button';
import DropDown from '@/components/Dropdown';
import Textarea from '@/components/Textarea';
import { X } from 'lucide-react';

import { sessionEvents } from "@/libs/apiClient";
import { useRouter } from "next/navigation";

interface SessionOptions {
  title: string;
  body: ReactNode;
  btnCaption?: string | undefined,
  onSubmit?: (formData: FormData, callback: (close: boolean) => void) => void;
}

type SessionContextType = {
  showModal: (options: SessionOptions) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useProgress must be used inside ProgressProvider');
  return context;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [modalOptions, setModalOptions] = useState<SessionOptions | undefined>();
  const [processing, setProcessing] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(10);

  const router = useRouter();

  // show modal
  const showModal = (options: SessionOptions) => {
    // set modal options
    setModalOptions(options);

    // show modal
    setVisible(true);
  };

  // on submit
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (typeof modalOptions?.onSubmit === "function") {
      // set processing on 
      setProcessing(true);

      // get form data
      const formData = new FormData(e.target);

      // on submit callbacks
      modalOptions?.onSubmit(formData, (close: boolean) => {
        // set processing on 
        setProcessing(false);

        // set visibility
        setVisible(close ? false : true);
      });
    } else {
      // show modal
      setVisible(false);
    }
  };

  const logout = async () => {
    // call api
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // get response data
    const data = await response.json();1

    // pause
    setTimeout(() => {
      // activate page progress
      // showProgress(false);

      // redirect to login
      router.push("/login");

      // pause
      // setTimeout(() => {
      //   // show message
      //   addToast(data.message, MessageTypes.Success, 1500);
      // }, 500);
    }, 500);
  }

  useEffect(() => {
    if (visible === true) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setVisible(false)
            clearInterval(timer);
            // router.push("/login");
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // return () => clearInterval(timer);
  }, [visible]);

  useEffect(() => {
    // const handler = () => setExpired(true);
    sessionEvents.on("sessionExpired", (d) => {
      console.log(d);
      setVisible(true)
    });
    // return () => sessionEvents.off("Session", handler);

  }, []);

  return (
    <SessionContext.Provider value={{ showModal }}>
      {children}
      {visible && (
        <div className={`fixed inset-0 z-[99999] bg-gray-900/50 w-full h-full overflow-y-auto`} aria-modal="true">
          <div className="relative max-w-2xl" style={{ margin: "50px auto" }}>
            <form className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t border-gray-200 dark:border-white/10">
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                  Heading
                </h3>
                <X size={22} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-100 cursor-pointer" onClick={() => setVisible(false)} />
              </div>
              <div className="p-3 md:p-4 space-y-4">
                <h1>{countdown}</h1>
              </div>
              <div className="flex justify-end items-center gap-2 p-3 md:p-4 border-t rounded-b border-gray-200 dark:border-white/10">
                <Button type="button" color="primary" onClick={() => setVisible(false)}>Submit</Button>
                <Button type="button" color="secondary" onClick={() => setVisible(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SessionContext.Provider>
  );
}
