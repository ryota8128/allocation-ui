import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

interface Props {}

const UserAddPage: NextPage<Props> = () => {
  const [showPassword1, setShowPassword1] = useState<boolean>(false);
  const [showPassword2, setShowPassword2] = useState<boolean>(false);
  const [isPasswordMatched, setIsPasswordMatched] = useState<boolean>(false);

  const [user, setUser] = useState<User>({ username: '', password: '', email: '' });
  const [confirmPassword, setConfirmPassword] = useState('');

  const onChangeUserInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const property = e.target.name as keyof User;
    const val = e.target.value;
    setUser({
      ...user,
      [property]: val,
    });
  };

  const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  useEffect(() => {
    if (user.password && user.password === confirmPassword) {
      setIsPasswordMatched(true);
    } else {
      setIsPasswordMatched(false);
    }
  }, [user, confirmPassword]);

  return (
    <div>
      <Form onSubmit={() => {}}>
        <FormGroup floating>
          <Input
            id="username"
            name="username"
            placeholder="username"
            type="text"
            onChange={onChangeUserInfo}
            style={{ width: 400 }}
          />
          <Label for="username">ユーザーネーム</Label>
        </FormGroup>
        <FormGroup floating>
          <Input
            id="email"
            name="email"
            placeholder="email"
            type="email"
            onChange={onChangeUserInfo}
            style={{ width: 400 }}
          />
          <Label for="email">メールアドレス</Label>
        </FormGroup>
        <FormGroup floating>
          <div style={{ display: 'flex', alignItems: 'center' }} className="search-box">
            <Input
              id="password"
              name="password"
              placeholder="password"
              type={showPassword1 ? 'text' : 'password'}
              onChange={onChangeUserInfo}
              style={{ width: 400 }}
            />
            <span onClick={() => setShowPassword1((prev) => !prev)}>
              {showPassword1 ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <Label for="password">パスワード</Label>
          <div style={{ display: 'flex', alignItems: 'center' }} className="search-box">
            <Input
              id="password"
              name="confirmPassword"
              placeholder="password確認用"
              type={showPassword2 ? 'text' : 'password'}
              onChange={onChangeConfirmPassword}
              style={{ width: 400 }}
            />
            <span onClick={() => setShowPassword2((prev) => !prev)}>
              {showPassword2 ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <Label for="confirmPassword">パスワード確認用</Label>
        </FormGroup>
        <Button disabled={!isPasswordMatched} color={isPasswordMatched ? 'primary' : 'secondary'}>
          登録
        </Button>
      </Form>
    </div>
  );
};

export default UserAddPage;
