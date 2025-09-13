import React, { useState } from 'react';
import { initialUsers, initialProjects, initialPortfolios, initialMarketListings } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardLayout from './components/DashboardLayout';

const App = () => {
  const [page, setPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  let content;
  switch (page) {
    case 'landing':
      content = <LandingPage setPage={setPage} projects={initialProjects} />;
      break;
    case 'login':
      content = <LoginPage setPage={setPage} setCurrentUser={setCurrentUser} users={initialUsers} />;
      break;
    case 'register':
      content = <RegisterPage setPage={setPage} />;
      break;
    case 'forgotPassword':
      content = <ForgotPasswordPage setPage={setPage} />;
      break;
    case 'investorDashboard':
    case 'developerDashboard':
    case 'adminDashboard':
      content = (
        <DashboardLayout
          currentUser={currentUser}
          sidebarItems={[]}
          activeItem="Dashboard"
          setActiveItem={() => {}}
          onLogout={() => { setCurrentUser(null); setPage('landing'); }}
          totalBalance={currentUser?.wallet?.usdt || 0}
        >
          <div className="p-6">Welcome to the dashboard.</div>
        </DashboardLayout>
      );
      break;
    default:
      content = <LandingPage setPage={setPage} projects={initialProjects} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header page={page} currentUser={currentUser} setPage={setPage} setCurrentUser={setCurrentUser} />
      <main className="flex-1">{content}</main>
      <Footer setPage={setPage} />
    </div>
  );
};

export default App;
