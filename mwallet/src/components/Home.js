import React from "react";
import { Button, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { WalletOutlined, KeyOutlined } from "@ant-design/icons";
import mwallet from "../mwallet.png";


function Home() {
  const navigate = useNavigate();
  const { Title, Paragraph } = Typography;

  return (

    <><div className="content">
    <img src={mwallet} alt="logo" className="mwalletLogo" />
    <Title level={2} style={{ color: "#ffffff", marginTop: "24px", marginBottom: "8px" }}>
      Crypto Wallet
    </Title>
    <Paragraph style={{ color: "#a0a0a0", fontSize: "16px", marginBottom: "40px" }}>
      Secure & Simple Digital Asset Management
    </Paragraph>
  
        
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Button
            onClick={() => navigate("/yourwallet")}
            className="frontPageButton"
            type="primary"
            size="large"
            icon={<WalletOutlined />}
          >
            Create New Wallet
          </Button>
          
          <Button
            onClick={() => navigate("/recover")}
            className="frontPageButton"
            type="default"
            size="large"
            icon={<KeyOutlined />}
          >
            Access Existing Wallet
          </Button>
        </Space>
        
        <div style={{ flexGrow: 1 }}></div>
        
        <p className="frontPageBottom">
          Powered by Data Dreamers
        </p>
      </div>
    </>
  );
}

export default Home;
