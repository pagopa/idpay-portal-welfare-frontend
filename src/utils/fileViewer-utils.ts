export const openInvoiceInNewTab = async (invoiceUrl: string): Promise<void> => {
    const response = await fetch(invoiceUrl);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch invoice: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // eslint-disable-next-line functional/no-let
    let contentType = response.headers.get('content-type') || blob.type;
    
    if (!contentType || contentType === 'application/octet-stream') {
        if (invoiceUrl.toLowerCase().endsWith('.xml')) {
            contentType = 'application/xml';
        } else {
            contentType = 'application/pdf';
        }
    }
    
    const typedBlob = new Blob([blob], { type: contentType });
    const blobUrl = URL.createObjectURL(typedBlob);
    
    window.open(blobUrl, '_blank');
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
};