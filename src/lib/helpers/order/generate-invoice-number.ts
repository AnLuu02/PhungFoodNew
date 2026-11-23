export const generateInvoiceNumber = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `INV-${datePart}-${randomPart}`;
};
