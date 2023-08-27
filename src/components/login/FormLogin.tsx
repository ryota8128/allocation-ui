import React, { MouseEventHandler, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import styles from './FormLogin.module.css';

type Props = {};

export const FormLogin: React.FC<Props> = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ username: '', password: '' });

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const changeShowStatus = () => {
    setShowPassword(!showPassword);
  };

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn('credentials', {
      username: user.username,
      password: user.password,
      callbackUrl: '/?login=success',
    });
  };

  return (
    <>
      <Form onSubmit={login}>
        <FormGroup floating>
          <Input
            id="username"
            name="username"
            placeholder="username"
            type="text"
            onChange={onChangeHandler}
            className={styles.login_form}
          />
          <Label for="username">ユーザーネーム</Label>
        </FormGroup>{' '}
        <FormGroup floating>
          <div style={{ display: 'flex', alignItems: 'center' }} className="search-box">
            <Input
              id="password"
              name="password"
              placeholder="password"
              type={showPassword ? 'text' : 'password'}
              onChange={onChangeHandler}
              className={styles.login_form}
            />
            <span onClick={changeShowStatus}>{showPassword ? <FaEye /> : <FaEyeSlash />}</span>
          </div>
          <Label for="password">パスワード</Label>
        </FormGroup>{' '}
        <Button>ログイン</Button>
      </Form>
    </>
  );
};

export default FormLogin;
