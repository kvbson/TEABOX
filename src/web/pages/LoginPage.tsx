interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <div>
        <h3>
          LOGIN: <input type="text" />
        </h3>
      </div>
      <div>
        <h3>
          HASŁO: <input type="password" />
        </h3>
        {/* tutaj wywołujemy prop onLogin */}
        <button onClick={onLogin}>LOGIN</button>
      </div>
    </div>
  );
};

export default LoginPage;
