import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../css/components/HeaderProfissional.css';

export function HeaderProfissional({ historicoCont = 0 }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="cabecalho-top">
      <div className="logo-area">
        <img src="/assets/logo-conect.png" alt="Logo ConectLar" className="logo-img" />
        <span className="badge-pro">Profissional</span>
      </div>
      <div className="menu-pro">
        <button onClick={() => navigate('/feed-trabalhador')}>Home</button>
        <button onClick={() => navigate('/historico-profissional')}>
          Histórico 
          <span className="badge-contador">{historicoCont}</span>
        </button>
        <button onClick={() => navigate('/perfil-trabalhador')}>Perfil</button>
        <button className="botao-sair" onClick={handleLogout}>Sair</button>
      </div>
    </header>
  );
}
