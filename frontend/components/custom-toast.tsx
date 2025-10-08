// components/custom-toast.tsx
import { useToast } from "@/components/ui/use-toast"

type ToastType = "success" | "error" | "warning" | "info"

interface CustomToastProps {
  type: ToastType
  title: string
  description?: string
  duration?: number
}

const toastConfig = {
  success: {
    icon: "🎉",
    titlePrefix: "",
  },
  error: {
    icon: "❌",
    titlePrefix: "",
  },
  warning: {
    icon: "⚠️",
    titlePrefix: "",
  },
  info: {
    icon: "ℹ️",
    titlePrefix: "",
  },
}

export function useCustomToast() {
  const { toast } = useToast()

  const showToast = ({ type, title, description, duration = 4000 }: CustomToastProps) => {
    const config = toastConfig[type]
    
    toast({
      title: `${config.icon} ${config.titlePrefix}${title}`,
      description,
      duration,
    })
  }

  return {
    success: (title: string, description?: string, duration?: number) =>
      showToast({ type: "success", title, description, duration }),
    error: (title: string, description?: string, duration?: number) =>
      showToast({ type: "error", title, description, duration }),
    warning: (title: string, description?: string, duration?: number) =>
      showToast({ type: "warning", title, description, duration }),
    info: (title: string, description?: string, duration?: number) =>
      showToast({ type: "info", title, description, duration }),
  }
}