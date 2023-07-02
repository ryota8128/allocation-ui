import { ReactComponentElement } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

import { NextPage } from 'next';

interface Props {}

const FormAddAccount: NextPage<Props> = () => {
  const addAccount = () => {};

  return (
    <>
      <Form>
        <FormGroup floating>
          <Input id="name" name="name" placeholder="Account Name" type="text" />
          <Label for="name">口座名</Label>
        </FormGroup>{' '}
        <FormGroup floating>
          <Input
            id="numFreeTransfer"
            name="numFreeTransfer"
            placeholder="numFreeTransfer"
            type="number"
          />
          <Label for="numFreeTransfer">月の無料振込回数</Label>
        </FormGroup>{' '}
        <FormGroup floating>
          <Input
            id="transferFee"
            name="transferFee"
            placeholder="transferFee"
            type="number"
          />
          <Label for="transferFee">1回あたりの振込手数料</Label>
        </FormGroup>{' '}
        <Button>Submit</Button>
      </Form>
    </>
  );
};

export default FormAddAccount;
