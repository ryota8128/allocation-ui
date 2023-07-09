import React, { MouseEventHandler, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { auth } from '@/lib/auth';
import User from '@/types/DbUser';
import { signIn } from 'next-auth/react';

type Props = {};

export const FormLogin: React.FC<Props> = () => {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [user, setUser] = useState<User>({ username: '', password: '' });
  const [loginState, setLoginState] = useState<boolean>(false);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
    console.log(user);
  };

  const changeShowStatus = () => {
    setShowPassword(!showPassword);
  };

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn('credentials', {
      username: user.username,
      password: user.password,
      callbackUrl: `http://localhost:3000/`,
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
          />
          <Label for="username">ユーザーネーム</Label>
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
      <h3>{loginState ? 'ログイン成功' : '未ログイン'}</h3>
    </>
  );
};

export default FormLogin;