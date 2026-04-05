const fallbackApiUrl = 'http://localhost:6040/inventario-reportes';

function getApiOrigin() {
  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
  const baseUrl = configuredApiUrl || fallbackApiUrl;

  try {
    return new URL(baseUrl).origin;
  } catch {
    return window.location.origin;
  }
}

export function buildPdfUrl(pdfPath: string) {
  if (!pdfPath) {
    return '';
  }

  if (/^https?:\/\//i.test(pdfPath)) {
    return pdfPath;
  }

  const normalizedPath = pdfPath.startsWith('/') ? pdfPath : `/${pdfPath}`;
  return `${getApiOrigin()}${normalizedPath}`;
}
