import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export function HeaderCliente({ historicoCont }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="cabecalho-top">
      <div className="logo-area">
        <img src="/assets/logo-conect.png" alt="Logo ConectLar" className="logo-img" />
      </div>
      <div className="teste">
        <button onClick={() => navigate('/painel-cliente')}>Home</button>
        <button onClick={() => navigate('/historico-cliente')}>
          Histórico{' '}
          <span className="badge-historico">
            {historicoCont}
          </span>
        </button>
        <button onClick={() => navigate('/perfil-cliente')}>Perfil</button>
        <button className="btn-sair" onClick={handleLogout}>Sair</button>
      </div>
    </header>
  );
}
