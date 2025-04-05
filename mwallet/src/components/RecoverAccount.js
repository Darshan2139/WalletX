import React, { useState } from "react";
import { Button, Card, Input, Typography, Alert, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { KeyOutlined, InfoCircleOutlined, LoginOutlined } from '@ant-design/icons';

function RecoverAccount({ setWallet, setSeedPhrase }) {
  const [phrase, setPhrase] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { Title, Text, Paragraph } = Typography;
  const { TextArea } = Input;
  const navigate = useNavigate();

  async function recoverWallet() {
    try {
      setErrorMessage("");
      const wallet = ethers.Wallet.fromPhrase(phrase.trim());
      
      setSeedPhrase(phrase.trim());
      setWallet(wallet.address);
      navigate("/Yourwallet");
    } catch (err) {
      setErrorMessage("Invalid seed phrase. Please check and try again.");
      console.error(err);
    }
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
          Access Existing Wallet
        </Title>
        
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div>
            <Paragraph style={{ color: "#a0a0a0", textAlign: "left", marginBottom: "10px" }}>
              Enter your seed phrase to restore your wallet:
            </Paragraph>
            
            <TextArea
              rows={4}
              placeholder="Enter your 12 word seed phrase, separated by spaces"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              style={{ 
                marginBottom: "10px", 
                resize: "none", 
                backgroundColor: "#222222", 
                border: "1px solid #333333",
                color: "#ffffff"
              }}
            />
            
            {errorMessage && (
              <Alert
                message={errorMessage}
                type="error"
                showIcon
                style={{ marginBottom: "15px" }}
              />
            )}
            
            <Alert
              icon={<InfoCircleOutlined />}
              type="info"
              message={
                <Text style={{ color: "#000000" }}>
                  Your seed phrase is never sent to any server and is only used locally to recover your wallet.
                </Text>
              }
              style={{ marginBottom: "20px" }}
            />
          </div>
          
          <Button
            style={{ width: "100%", height: "46px" }}
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            onClick={recoverWallet}
            disabled={!phrase.trim()}
          >
            Access Wallet
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default RecoverAccount;
