import { ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
  children: ReactNode;
};

const AppTitle: React.FC<Props> = ({ children }) => {
  return (
    <>
      <StyledAppTitle>{children}</StyledAppTitle>
    </>
  );
};

export default AppTitle;

const StyledAppTitle = styled.p`
  color: #000;
  text-align: center;
  text-shadow: 2px 2px rgba(0, 0, 0, 0.25);
  font-family: Inter;
  font-size: 23px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 173.913% */
`;
