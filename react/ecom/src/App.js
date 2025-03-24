import './App.css';
import Layout from './components/Layout/Layout'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Layout />
    </>
  );
}

export default App;
