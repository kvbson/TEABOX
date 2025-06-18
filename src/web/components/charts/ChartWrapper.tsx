import { ReactNode } from 'react';

const ChartWrapper: React.FC<{children: ReactNode}> = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5%' }}>
    {children}
  </div>
);

export default ChartWrapper;
