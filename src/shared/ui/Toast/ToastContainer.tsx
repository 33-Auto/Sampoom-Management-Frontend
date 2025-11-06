import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { useNotification } from "@/app/providers/NotificationContext";

import { Toast } from "./Toast";

export function ToastContainer() {
  const { toasts, removeToast } = useNotification();
  const [exitingToasts, setExitingToasts] = useState<Set<string>>(new Set());
  const [toastsToRender, setToastsToRender] = useState<typeof toasts>([]);

  // Toast 추가/제거 관리 및 exit 애니메이션 적용
  useEffect(() => {
    const currentToastIds = new Set(toasts.map((t) => t.id));
    const renderToastIds = new Set(toastsToRender.map((t) => t.id));

    // 새로운 toast 추가 (toasts에 있지만 toastsToRender에 없는 것)
    toasts.forEach((toast) => {
      if (!renderToastIds.has(toast.id)) {
        setToastsToRender((prev) => {
          if (prev.some((t) => t.id === toast.id)) {
            return prev;
          }
          return [...prev, toast];
        });
        setExitingToasts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(toast.id);
          return newSet;
        });
      }
    });

    // 사라진 toast에 exit 애니메이션 적용
    renderToastIds.forEach((id) => {
      if (!currentToastIds.has(id) && !exitingToasts.has(id)) {
        setExitingToasts((prev) => new Set(prev).add(id));
        // 애니메이션 완료 후 실제로 제거
        setTimeout(() => {
          setToastsToRender((prev) => prev.filter((t) => t.id !== id));
          setExitingToasts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }, 200);
      }
    });
  }, [toasts, toastsToRender, exitingToasts]);

  const handleClose = (id: string) => {
    setExitingToasts((prev) => new Set(prev).add(id));
    // 애니메이션 완료 후 제거 (200ms)
    setTimeout(() => {
      removeToast(id);
      setToastsToRender((prev) => prev.filter((t) => t.id !== id));
      setExitingToasts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 200);
  };

  if (toastsToRender.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toastsToRender.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => handleClose(toast.id)}
          exiting={exitingToasts.has(toast.id)}
        />
      ))}
    </div>,
    document.body,
  );
}
