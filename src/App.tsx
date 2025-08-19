import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardPage from './page/DashboardPage';
import ExcelUpload from './features/tareas/ExcelUpload';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ExcelUpload/>
      <DashboardPage />
      <ToastContainer /> {/* 💬 Importante para mostrar notificaciones */}
    </div>
  );
};

export default App