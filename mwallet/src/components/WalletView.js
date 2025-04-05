import React, { useEffect, useState } from "react";
import {
  Divider,
  Tooltip,
  List,
  Avatar,
  Spin,
  Tabs,
  Input,
  Button,
  Card,
  Typography,
} from "antd";
import { 
  LogoutOutlined, 
  SendOutlined, 
  CopyOutlined,
  WalletOutlined,
  FileImageOutlined,
  TokenOutlined,
  DollarOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../noImg.png";
import axios from "axios";
import { CHAINS_CONFIG } from "../chains";
import { ethers } from "ethers";

const CustomIcon = () => (
  <img src="path/to/your/icon.svg" alt="Custom Icon" style={{ width: 16, height: 16 }} />
);

function WalletView({
  wallet,
  setWallet,
  seedPhrase,
  setSeedPhrase,
  selectedChain,
}) {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [balance, setBalance] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);
  const { Title, Text } = Typography;

  const items = [
    {
      key: "3",
      label: `Tokens`,
      icon: <CustomIcon />,
      children: (
        <>
          {tokens ? (
            <>
              <List
                bordered
                itemLayout="horizontal"
                dataSource={tokens}
                renderItem={(item, index) => (
                  <List.Item style={{ textAlign: "left" }}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.logo || logo} />}
                      title={<Text strong style={{ color: "#ffffff" }}>{item.symbol}</Text>}
                      description={<Text style={{ color: "#a0a0a0" }}>{item.name}</Text>}
                    />
                    <div style={{ color: "#ffffff" }}>
                      {(
                        Number(item.balance) /
                        10 ** Number(item.decimals)
                      ).toFixed(2)}{" "}
                      Tokens
                    </div>
                  </List.Item>
                )}
              />
            </>
          ) : (
            <Card style={{ backgroundColor: "#1a1a1a", border: "1px solid #333333", borderRadius: "10px", marginTop: "20px" }}>
              <Text style={{ color: "#a0a0a0" }}>No tokens found in your wallet</Text>
            </Card>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: `NFTs`,
      icon: <FileImageOutlined />,
      children: (
        <>
          {nfts ? (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px" }}>
              {nfts.map((e, i) => (
                e && (
                  <img
                    key={i}
                    className="nftImage"
                    alt="nftImage"
                    src={e}
                  />
                )
              ))}
            </div>
          ) : (
            <Card style={{ backgroundColor: "#1a1a1a", border: "1px solid #333333", borderRadius: "10px", marginTop: "20px" }}>
              <Text style={{ color: "#a0a0a0" }}>No NFTs found in your wallet</Text>
            </Card>
          )}
        </>
      ),
    },
    {
      key: "1",
      label: `Transfer`,
      icon: <SendOutlined />,
      children: (
        <Card style={{ backgroundColor: "#1a1a1a", border: "1px solid #333333", borderRadius: "10px", marginTop: "10px" }}>
          <Title level={5} style={{ color: "#a0a0a0", margin: "0 0 5px 0" }}>Native Balance</Title>
          <Title level={3} style={{ color: "#ffffff", margin: "0 0 20px 0" }}>
            {balance.toFixed(2)} {CHAINS_CONFIG[selectedChain].ticker}
          </Title>
          <div className="sendRow">
            <Text style={{ width: "90px", textAlign: "left", color: "#ffffff" }}>To:</Text>
            <Input
              value={sendToAddress}
              onChange={(e) => setSendToAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>
          <div className="sendRow">
            <Text style={{ width: "90px", textAlign: "left", color: "#ffffff" }}>Amount:</Text>
            <Input
              value={amountToSend}
              onChange={(e) => setAmountToSend(e.target.value)}
              placeholder="Amount to send"
            />
          </div>
          <Button
            style={{ width: "100%", marginTop: "20px", marginBottom: "20px", height: "46px" }}
            type="primary"
            size="large"
            icon={<SendOutlined />}
            onClick={() => sendTransaction(sendToAddress, amountToSend)}
          >
            Send Tokens
          </Button>
          {processing && (
            <div style={{ textAlign: "center", padding: "10px" }}>
              <Spin />
              {hash && (
                <Tooltip title={hash}>
                  <Text style={{ color: "#a0a0a0", marginTop: "10px", display: "block", cursor: "pointer" }}>
                    <CopyOutlined style={{ marginRight: "5px" }} />
                    View Transaction Details
                  </Text>
                </Tooltip>
              )}
            </div>
          )}
        </Card>
      ),
    },
  ];

  async function sendTransaction(to, amount) {
    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
      to: to,
      value: ethers.parseEther(amount.toString()),
    };

    setProcessing(true);
    try{
      const transaction = await wallet.sendTransaction(tx);

      setHash(transaction.hash);
      const receipt = await transaction.wait();

      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);

      if (receipt.status === 1) {
        getAccountTokens();
      } else {
        console.log("failed");
      }


    }catch(err){
      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);
    }
  }

  async function getAccountTokens() {
    setFetching(true);

    const res = await axios.get(`http://localhost:3001/getTokens`, {
      params: {
        userAddress: wallet,
        chain: selectedChain,
      },
    });

    const response = res.data;

    if (response.tokens.length > 0) {
      setTokens(response.tokens);
    }

    if (response.nfts.length > 0) {
      setNfts(response.nfts);
    }

    setBalance(response.balance);

    setFetching(false);
  }

  function logout() {
    setSeedPhrase(null);
    setWallet(null);
    setNfts(null);
    setTokens(null);
    setBalance(0);
    navigate("/");
  }

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setNfts(null);
    setTokens(null);
    setBalance(0);
    getAccountTokens();
  }, []);

  useEffect(() => {
    if (!wallet) return;
    setNfts(null);
    setTokens(null);
    setBalance(0);
    getAccountTokens();
  }, [selectedChain]);

  return (
    <>
      <div className="content">
        <div className="logoutButton" onClick={logout}>
          <LogoutOutlined />
        </div>
        
        <Card 
          style={{ 
            width: "100%", 
            backgroundColor: "#1a1a1a", 
            border: "1px solid #333333", 
            borderRadius: "10px", 
            marginBottom: "15px",
            marginTop: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "5px" }}>
            <WalletOutlined style={{ fontSize: "18px", marginRight: "10px", color: "#ffffff" }} />
            <Text strong style={{ color: "#ffffff", fontSize: "16px" }}>Wallet Address</Text>
          </div>
          <Tooltip title={wallet}>
            <Text style={{ color: "#a0a0a0", cursor: "pointer" }}>
              {wallet.slice(0, 6)}...{wallet.slice(38)}
              <CopyOutlined style={{ marginLeft: "5px" }} />
            </Text>
          </Tooltip>
        </Card>
        
        <Divider style={{ margin: "5px 0 15px 0" }} />
        
        {fetching ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Tabs defaultActiveKey="1" items={items} className="walletView" />
        )}
      </div>
    </>
  );
}

export default WalletView;
