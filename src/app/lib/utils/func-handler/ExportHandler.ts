export async function downloadInvoice() {
  const response = await fetch('/api/invoice');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'invoice.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
