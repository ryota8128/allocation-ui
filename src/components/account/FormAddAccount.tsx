import { useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

import Account from '@/types/Account';
import { addAccount } from '@/lib/accountReq';

interface Props {}

const FormAddAccount: React.FC<Props> = () => {
  const [account, setAccount] = useState<Account>({
    name: '',
    numFreeTransfer: 0,
    transferFee: 0,
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(account);
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Form onSubmit={(event) => addAccount(event, account)}>
        <FormGroup floating>
          <Input
            id="name"
            name="name"
            placeholder="Account Name"
            type="text"
            onChange={onChangeHandler}
          />
          <Label for="name">口座名</Label>
        </FormGroup>{' '}
        <FormGroup floating>
          <Input
            id="numFreeTransfer"
            name="numFreeTransfer"
            placeholder="numFreeTransfer"
            type="number"
            onChange={onChangeHandler}
          />
          <Label for="numFreeTransfer">月の無料振込回数</Label>
        </FormGroup>{' '}
        <FormGroup floating>
          <Input
            id="transferFee"
            name="transferFee"
            placeholder="transferFee"
            type="number"
            onChange={onChangeHandler}
          />
          <Label for="transferFee">1回あたりの振込手数料</Label>
        </FormGroup>{' '}
        <Button>Submit</Button>
      </Form>
    </>
  );
};

export default FormAddAccount;
