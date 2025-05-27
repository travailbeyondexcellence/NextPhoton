"use client";

import { toast as sonnerToast } from "sonner";

type Variant = "default" | "success" | "error" | "warning" | "info" | "destructive";

type ToasterToast = {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    duration?: number;
    variant?: Variant;
    important?: boolean;
};

function toast({
    title,
    description,
    actionLabel,
    onAction,
    duration = 4000,
    variant = "default",
    important = false,
}: ToasterToast) {
    const toastFn =
        variant === "success"
            ? sonnerToast.success
            : variant === "error" || variant === "destructive"
                ? sonnerToast.error
                : variant === "warning"
                    ? sonnerToast.warning
                    : variant === "info"
                        ? sonnerToast.info
                        : sonnerToast; // default

    toastFn(title || "", {
        description,
        duration,
      
        action: actionLabel && onAction
            ? {
                label: actionLabel,
                onClick: onAction,
            }
            : undefined,
    });
}

function useToast() {
    return { toast };
}

export { useToast, toast };