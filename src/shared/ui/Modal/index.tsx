import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  widthClassName?: string; // e.g., max-w-3xl
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  widthClassName = "max-w-3xl",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={`relative w-full ${widthClassName} mx-4 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-bg-card-black`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
