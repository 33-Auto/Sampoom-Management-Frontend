import React, { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  widthClassName?: string; // e.g., max-w-3xl
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  widthClassName = "max-w-3xl",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // 전에 포커스 되어있던 컴포넌트를 일단 저장한다.
    // 추후 modal이 사라져도 그 컴포넌트가 포커스를 유지될 수 있게
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // 포커스 트랩: modal 내부에서만 포커스가 유지되도록 한다.
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab 키를 누르면 맨 처음 요소로 포커스를 이동한다.
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          // Tab 키를 누르면 맨 마지막 요소로 포커스를 이동한다.
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // modal이 열리면 자동으로 포커스를 맨 처음 요소로 이동한다.
    modalRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // 전에 포커스 되어있던 컴포넌트로 다시 포커스를 이동한다.
      previousActiveElementRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        className={`relative w-full ${widthClassName} mx-4 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-bg-card-black`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          {title && (
            <h3
              id="modal-title"
              className="text-lg font-semibold dark:text-white"
            >
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="닫기"
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
