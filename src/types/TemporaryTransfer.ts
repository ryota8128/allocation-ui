import toast from 'react-hot-toast';
type TemporaryTransfer = {
  id: number;
  fromAccount?: number;
  toAccount?: number;
  description?: string;
  amount: number;
  userId: number;
  transferId: number;
};

export default TemporaryTransfer;
