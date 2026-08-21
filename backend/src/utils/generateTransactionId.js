export const generateTransactionId = () => {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};