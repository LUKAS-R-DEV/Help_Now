import { FiLoader } from 'react-icons/fi';
import '../styles/loadingSpinner.css';

export default function LoadingSpinner({ texto = 'Carregando...' }) {
  return (
    <div className="spinner-container">
      <FiLoader className="spinner-icon" />
      <p>{texto}</p>
    </div>
  );
}
