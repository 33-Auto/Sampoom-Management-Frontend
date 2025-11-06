// TODO 추후에 useContext를 zustand로 대체할 예정
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { Button, ToastContainer, Modal } from "@/shared/ui";

interface ToastNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

interface ConfirmModal {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "danger" | "primary";
}

interface NotificationContextType {
  // Toast 관련
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, "id">) => void;
  removeToast: (id: string) => void;

  // 확인 모달 관련
  confirmModal: ConfirmModal | null;
  showConfirm: (modal: Omit<ConfirmModal, "id">) => void;
  hideConfirm: () => void;

  // 편의 메서드
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;

  // 기존 호환을 위한 메서드
  addNotification?: (notification: any) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);

  const showToast = (toast: Omit<ToastNotification, "id">) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // 자동 제거
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showConfirm = (modal: Omit<ConfirmModal, "id">) => {
    const id = Date.now().toString();
    setConfirmModal({ ...modal, id });
  };

  const hideConfirm = () => {
    setConfirmModal(null);
  };

  // 편의 메서드들
  const showSuccess = (title: string, message?: string) => {
    showToast({ type: "success", title, message });
  };

  const showError = (title: string, message?: string) => {
    showToast({ type: "error", title, message });
  };

  const showWarning = (title: string, message?: string) => {
    showToast({ type: "warning", title, message });
  };

  const showInfo = (title: string, message?: string) => {
    showToast({ type: "info", title, message });
  };

  // 기존 호환을 위한 메서드
  const addNotification = (notification: any) => {
    if (notification.type && notification.message) {
      showToast({ type: notification.type, title: notification.message });
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        confirmModal,
        showConfirm,
        hideConfirm,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        addNotification,
      }}
    >
      {children}
      <ToastContainer />
      {confirmModal && (
        <Modal
          open={!!confirmModal}
          onClose={() => {
            confirmModal.onCancel?.();
            hideConfirm();
          }}
          title={confirmModal.title}
          widthClassName="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  confirmModal.onCancel?.();
                  hideConfirm();
                }}
              >
                {confirmModal.cancelText || "취소"}
              </Button>
              <Button
                variant={
                  confirmModal.variant === "danger" ? "destructive" : "default"
                }
                onClick={() => {
                  confirmModal.onConfirm();
                  hideConfirm();
                }}
              >
                {confirmModal.confirmText || "확인"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("NotificationProvider 안에 정의되어야 합니다");
  }
  return context;
}
