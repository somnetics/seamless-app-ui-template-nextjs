import { createContext, useContext, useState, ReactNode } from 'react';
import Button from '@/components/Button';
import DropDown from '@/components/Dropdown';
import { X } from 'lucide-react';

interface ModalOptions {
  title: string;
  body: ReactNode;
  btnCaption?: string | undefined,
  onSubmit?: (formData: FormData, callback: (close: boolean) => void) => void;
}

type ModalContextType = {
  showModal: (options: ModalOptions) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useProgress must be used inside ProgressProvider');
  return context;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalOptions, setModalOptions] = useState<ModalOptions | undefined>();
  const [processing, setProcessing] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  // show modal
  const showModal = (options: ModalOptions) => {
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

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      {visible && (
        <div className={`fixed inset-0 z-[99999] bg-gray-900/50 w-full h-full overflow-y-auto`} aria-modal="true">
          <div className="relative max-w-2xl" style={{ margin: "50px auto" }}>
            <form className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t border-gray-200 dark:border-white/10">
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                  {modalOptions?.title}
                </h3>
                <X size={22} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-100 cursor-pointer" onClick={() => setVisible(false)} />
              </div>
              <div className="p-3 md:p-4 space-y-4">
                {modalOptions?.body}
              
                <DropDown
                  label={'status'}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" }
                  ]}
                />
              </div>

              <div className="flex justify-end items-center gap-2 p-3 md:p-4 border-t rounded-b border-gray-200 dark:border-white/10">
                <Button type="button" color="primary" onClick={() => setVisible(false)}>Submit</Button>
                <Button type="button" color="secondary" onClick={() => setVisible(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
