import React, { useState } from "react";
import { Button, Card, Alert, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { InfoCircleOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';

function CreateAccount({ setWallet, setSeedPhrase }) {
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);
  const [creatingWallet, setCreatingWallet] = useState(false);
  const { Title, Text, Paragraph } = Typography;
  const navigate = useNavigate();

  async function createWallet() {
    setCreatingWallet(true);
    const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(16));
    const wallet = ethers.Wallet.fromPhrase(mnemonic);

    setNewSeedPhrase(mnemonic);
    setWallet(wallet.address);
    setSeedPhrase(mnemonic);
    setCreatingWallet(false);
  }

  return (
    <div className="content">
      <Card 
        style={{ 
          width: "100%", 
          backgroundColor: "#1a1a1a", 
          border: "1px solid #333333", 
          borderRadius: "10px", 
          marginTop: "10px" 
        }}
      >
        <Title level={3} style={{ color: "#ffffff", marginBottom: "15px" }}>
          Create New Wallet
        </Title>
        
        {newSeedPhrase ? (
          <>
            <Alert
              message="Important Security Notice"
              description={
                <Paragraph style={{ color: "#000000" }}>
                  Please store this seed phrase securely. It's the only way to recover your wallet.
                </Paragraph>
              }
              type="warning"
              showIcon
              icon={<InfoCircleOutlined />}
              style={{ marginBottom: "20px" }}
            />
            
            <Card 
              className="seedPhraseContainer"
              title={<Text strong style={{ color: "#ffffff" }}>Your Seed Phrase</Text>}
            >
              <Paragraph style={{ color: "#ffffff", fontSize: "16px", wordSpacing: "5px", textAlign: "center" }}>
                {newSeedPhrase}
              </Paragraph>
            </Card>
            
            <Button
              style={{ width: "100%", marginTop: "20px", height: "46px" }}
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={() => navigate("/Yourwallet")}
            >
              I've Saved My Seed Phrase
            </Button>
          </>
        ) : (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Paragraph style={{ color: "#a0a0a0" }}>
              Create a new wallet to store and manage your digital assets securely.
            </Paragraph>
            
            <Button
              style={{ width: "100%", marginTop: "20px", height: "46px" }}
              type="primary"
              size="large"
              icon={<LockOutlined />}
              onClick={createWallet}
              loading={creatingWallet}
            >
              Generate New Wallet
            </Button>
            {newSeedPhrase}
          </Space>
        )}
      </Card>
    </div>
  );
}

export default CreateAccount;
