import { ReactNode } from 'react';

const ChartWrapper: React.FC<{children: ReactNode, title: string}> = ({ children, title }) => (
  <div className="game-showcase">
    <div style={{ width: '100%', textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-inter)' }}>
      <h3 style={{ color: 'var(--color-text)', marginBottom: '1rem', fontSize: '1.5rem' }}>{title}</h3>
      {children}
    </div>
  </div>
);

export default ChartWrapper;
