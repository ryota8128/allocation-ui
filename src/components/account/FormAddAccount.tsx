import { useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

import { NextPage } from 'next';
import Account from '@/domain/Account';
import axios, { AxiosRequestConfig } from 'axios';

interface Props {}

const FormAddAccount: NextPage<Props> = () => {
  const addAccount = async (
    event: React.FormEvent<HTMLFormElement>,
    account: Account
  ) => {
    event.preventDefault();
    account.ownerId = 1;
    const config: AxiosRequestConfig<Account> = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      alert(JSON.stringify(account));
      const response = await axios.post(
        'http://localhost:8080/api/account',
        account,
        config
      );
      alert(response.data);
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      console.log('finally');
      alert('finally');
    }
  };
  const [account, setAccount] = useState<Account>({
    name: '',
    numFreeTransfer: 0,
    transferFee: 0,
  });

  const onChangeHander = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            onChange={onChangeHander}
          />
          <Label for="name">口座名</Label>
        </FormGroup>{' '}
        <FormGroup floating>
          <Input
            id="numFreeTransfer"
            name="numFreeTransfer"
            placeholder="numFreeTransfer"
            type="number"
            onChange={onChangeHander}
          />
          <Label for="numFreeTransfer">月の無料振込回数</Label>
        </FormGroup>{' '}
        <FormGroup floating>
          <Input
            id="transferFee"
            name="transferFee"
            placeholder="transferFee"
            type="number"
            onChange={onChangeHander}
          />
          <Label for="transferFee">1回あたりの振込手数料</Label>
        </FormGroup>{' '}
        <Button>Submit</Button>
      </Form>
    </>
  );
};

export default FormAddAccount;
