import React, { MouseEventHandler, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './FormLogin.module.css';

type Props = {};

export const FormLogin: React.FC<Props> = () => {
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  const changeShowStatus = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Form onSubmit={() => {}}>
        <FormGroup floating>
          <Input
            id="email"
            name="email"
            placeholder="email"
            type="email"
            onChange={onChangeHandler}
          />
          <Label for="name">メールアドレス</Label>
        </FormGroup>{' '}
        <FormGroup floating>
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            className="search-box"
          >
            <Input
              id="password"
              name="password"
              placeholder="password"
              type={showPassword ? 'text' : 'password'}
              onChange={onChangeHandler}
            />
            <span onClick={changeShowStatus}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <Label for="password">パスワード</Label>
        </FormGroup>{' '}
        <Button>Submit</Button>
      </Form>
    </>
  );
};

export default FormLogin;
