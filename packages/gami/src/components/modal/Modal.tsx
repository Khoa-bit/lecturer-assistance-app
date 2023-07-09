import Portal from "../HOC/Portal";

interface ModalProps {
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  id,
  isOpen,
  setIsOpen,
  title,
  children,
}: ModalProps) {
  return (
    <>
      <Portal>
        <div>
          <input
            type="checkbox"
            id={id}
            className="modal-toggle"
            onChange={() => {
              setIsOpen((isOpen) => !isOpen);
            }}
            checked={isOpen}
          />
          <div className="modal modal-bottom sm:modal-middle">
            <label
              htmlFor={id}
              className={`fixed inset-0 w-full cursor-pointer bg-slate-400/70`}
            ></label>
            <div className="modal-box !rounded-lg bg-white p-2 shadow-lg lg:min-w-fit">
              <h2 className="collapse-title flex p-2 font-semibold text-gray-600">
                <strong className="flex-grow text-xl font-semibold text-gray-700">
                  {title}
                </strong>
                <label
                  htmlFor={id}
                  title="Close modal"
                  aria-label="Close modal"
                >
                  <span className="material-symbols-rounded cursor-pointer [font-variation-settings:'FILL'_1] hover:text-gray-500">
                    cancel
                  </span>
                </label>
              </h2>
              {children}
            </div>
          </div>
        </div>
      </Portal>
    </>
  );
}
