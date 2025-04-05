import "./App.css";
import { useState, useEffect } from "react";
import { Select, Typography, message } from "antd";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import RecoverAccount from "./components/RecoverAccount";
import WalletView from "./components/WalletView";
import Login from "./components/Login";
import { BlockOutlined, LogoutOutlined } from "@ant-design/icons";

function App() {
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [selectedChain, setSelectedChain] = useState("0x13882");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { Text } = Typography;
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['isNewUser', 'walletPassword'], (result) => {
        if (result.isNewUser === false && result.walletPassword) {
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      });
    } else {
      // Fallback for development environment
      const isNewUser = localStorage.getItem('isNewUser');
      const walletPassword = localStorage.getItem('walletPassword');
      if (isNewUser === 'false' && walletPassword) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear wallet and seed phrase
    setWallet(null);
    setSeedPhrase(null);
    setIsAuthenticated(false);

    // Clear storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.remove(['walletPassword', 'isNewUser'], () => {
        navigate('/');
        message.success('Logged out successfully');
      });
    } else {
      localStorage.removeItem('walletPassword');
      localStorage.removeItem('isNewUser');
      navigate('/');
      message.success('Logged out successfully');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login setIsAuthenticated={setIsAuthenticated} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <BlockOutlined className="logo-icon" />
          <Text strong className="logo-text">WalletX</Text>
        </div>
        <div className="header-right">
          <Select
            onChange={(val) => setSelectedChain(val)}
            value={selectedChain}
            options={[
              {
                label: "Polygon Amoy",
                value: "0x13882",
              },
              {
                label: "Ethereum",
                value: "0x1", 
              },
            ]}
            className="chain-dropdown"
            dropdownStyle={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
          />
          <LogoutOutlined 
            className="logout-icon"
            onClick={handleLogout}
            title="Logout"
          />
        </div>
      </header>
      {wallet && seedPhrase ? (
        <Routes>
          <Route
            path="/Yourwallet"
            element={
              <WalletView
                wallet={wallet}
                setWallet={setWallet}
                seedPhrase={seedPhrase}
                setSeedPhrase={setSeedPhrase}
                selectedChain={selectedChain}
              />
            }
          />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/recover"
            element={
              <RecoverAccount
                setSeedPhrase={setSeedPhrase}
                setWallet={setWallet}
              />
            }
          />
          <Route
            path="/Yourwallet"
            element={
              <CreateAccount
                setSeedPhrase={setSeedPhrase}
                setWallet={setWallet}
              />
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
