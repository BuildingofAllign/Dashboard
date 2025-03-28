
import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  description?: string;
  duration?: number;
  position?: "top-right" | "top-center" | "top-left" | "bottom-left" | "bottom-center" | "bottom-right";
  action?: {
    label: string;
    onClick: () => void;
  };
  closeButton?: boolean;
}

export const showToast = (
  type: ToastType,
  title: string,
  options?: ToastOptions
) => {
  const { description, duration = 5000, position = "bottom-right", action, closeButton = true } = options || {};

  const toastOptions = {
    description,
    duration,
    position,
    action,
    closeButton,
  };

  switch (type) {
    case "success":
      return toast.success(title, toastOptions);
    case "error":
      return toast.error(title, toastOptions);
    case "info":
      return toast.info(title, toastOptions);
    case "warning":
      return toast.warning(title, toastOptions);
    default:
      return toast(title, toastOptions);
  }
};

export const toastSuccess = (title: string, options?: ToastOptions) => showToast("success", title, options);
export const toastError = (title: string, options?: ToastOptions) => showToast("error", title, options);
export const toastInfo = (title: string, options?: ToastOptions) => showToast("info", title, options);
export const toastWarning = (title: string, options?: ToastOptions) => showToast("warning", title, options);
