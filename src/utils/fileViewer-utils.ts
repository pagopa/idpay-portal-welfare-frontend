export const openInvoiceInNewTab = async (
    invoiceUrl: string,
    fileName: string
): Promise<void> => {
    const response = await fetch(invoiceUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch invoice: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();

    // eslint-disable-next-line functional/no-let
    let contentType = response.headers.get("content-type") || blob.type;

    if (!contentType || contentType === "application/octet-stream") {
        if (invoiceUrl.toLowerCase().endsWith(".xml")) {
            contentType = "application/xml";
        } else {
            contentType = "application/pdf";
        }
    }

    const typedBlob = new Blob([blob], { type: contentType });
    const blobUrl = URL.createObjectURL(typedBlob);

    const html = `
    <html>
      <head>
        <title>${fileName}</title>
      </head>
      <body style="margin:0">
        <iframe src="${blobUrl}" style="width:100%;height:100vh;border:none;"></iframe>
      </body>
    </html>
  `;

    const htmlBlob = new Blob([html], { type: "text/html" });
    const htmlUrl = URL.createObjectURL(htmlBlob);

    window.open(htmlUrl, "_blank");

    setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        URL.revokeObjectURL(htmlUrl);
    }, 60000);
};