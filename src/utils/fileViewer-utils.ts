/* eslint-disable functional/immutable-data */
export const openInvoiceInNewTab = async (
  invoiceUrl: string,
  fileName?: string
): Promise<void> => {
  const res = await fetch(invoiceUrl, { method: "GET" });

  if (!res.ok) {
    throw new Error(`Failed to fetch invoice: ${res.status}`);
  }

  // eslint-disable-next-line functional/immutable-data
  const ext = fileName?.split(".").pop()?.toLowerCase() || "";

  // eslint-disable-next-line functional/no-let
  let mimeFromExt = "";
  if (ext === "pdf") {
    mimeFromExt = "application/pdf";
  } else if (ext === "xml") {
    mimeFromExt = "application/xml";
  } else {
    // fallback (stessa logica del tuo codice)
    mimeFromExt = res.headers.get("content-type") || "application/octet-stream";
  }

  const blob = await res.blob();
  const typedBlob = new Blob([blob], { type: mimeFromExt });

  const blobUrl = URL.createObjectURL(typedBlob);

  const newWindow = window.open(blobUrl, "_blank");

  if (newWindow && fileName) {
    setTimeout(() => {
      try {
        // eslint-disable-next-line functional/immutable-data
        newWindow.document.title = fileName;
      // eslint-disable-next-line no-empty
      } catch { }
    }, 100);
  }

  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
};

export const downloadCsv = (url: string, fileName: string): void => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
