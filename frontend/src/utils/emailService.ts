interface Invoice {
  invoiceNumber: string;
  client: string;
  clientEmail: string;
  total: number;
}

export const sendEmail = (invoice: Invoice): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate email sending delay
    setTimeout(() => {
      console.log(`Email sent to ${invoice.clientEmail} with invoice ${invoice.invoiceNumber}`);
      console.log(`Invoice total: $${invoice.total.toFixed(2)}`);
      resolve();
    }, 1500);
  });
};
