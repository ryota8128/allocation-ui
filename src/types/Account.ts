interface Account {
  id?: number;
  name: string;
  numFreeTransfer?: number;
  transferFee?: number;
  ownerId?: number;
  isChanged?: boolean;
  via?: number;
}
