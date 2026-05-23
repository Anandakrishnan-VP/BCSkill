import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content-area">
        {children}
      </div>
    </div>
  );
}
