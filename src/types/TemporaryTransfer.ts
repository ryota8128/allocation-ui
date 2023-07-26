type TemporaryTransfer = {
  id: number;
  fromAccount?: number;
  toAccount?: number;
  fromAccountName?: string;
  toAccountName?: string;
  description?: string;
  amount: number;
  userId: number;
  transferId: number;
  type: 'temporary';
  isChanged?: boolean;
};
