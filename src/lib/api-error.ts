export function getApiErrorMessage(
  error: unknown,
  fallback = "Ocurrio un error inesperado",
): string {
  const maybeError = error as {
    message?: string;
    response?: {
      data?: {
        message?: unknown;
        error?: {
          message?: unknown;
          details?: unknown;
        };
      };
    };
  };

  const details = maybeError.response?.data?.error?.details;
  if (Array.isArray(details) && details.length > 0) {
    return details.join(", ");
  }

  const backendErrorMessage = maybeError.response?.data?.error?.message;
  if (typeof backendErrorMessage === "string" && backendErrorMessage.trim()) {
    return backendErrorMessage;
  }

  const legacyMessage = maybeError.response?.data?.message;
  if (Array.isArray(legacyMessage) && legacyMessage.length > 0) {
    return legacyMessage.join(", ");
  }

  if (typeof legacyMessage === "string" && legacyMessage.trim()) {
    return legacyMessage;
  }

  if (typeof maybeError.message === "string" && maybeError.message.trim()) {
    return maybeError.message;
  }

  return fallback;
}
