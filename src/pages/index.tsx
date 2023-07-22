import AppTitle from '@/components/home/AppTitle';
import Item from '@/components/home/Item';
import { NextPage } from 'next';

interface Props {}

const Index: NextPage<Props> = () => {
  return (
    <>
      <div className="container">
        <AppTitle>Money Allocation App</AppTitle>
        <Item>新規振替</Item>
      </div>
    </>
  );
};

export default Index;
