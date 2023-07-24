type RegularTransfer = {
  id: number;
  fromAccount?: number;
  toAccount?: number;
  fromAccountName?: string;
  toAccountName?: string;
  description?: string;
  percentage: boolean;
  amount?: number;
  ratio?: number;
  userId: number;
  type: 'regular';
};
