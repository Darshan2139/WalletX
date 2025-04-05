const Ethereum = {
    hex: '0x1',
    name: 'Ethereum',
    rpcUrl: '',
    ticker: "ETH"
};

const MumbaiTestnet = {
    hex: '0x13881',
    name: 'Mumbai Testnet',
    rpcUrl: '',
    ticker: "MATIC"
};

const Polygon = {
    hex: '0x89',
    name: 'Polygon',
    rpcUrl: '',
    ticker: "MATIC"
};

const Avalanche = {
    hex: '0xa86a',
    name: 'Avalanche',
    rpcUrl: '',
    ticker: "AVAX"
};

const PolygonAmoy = {
    hex: '0x13882',
    name: 'Polygon Amoy',
    rpcUrl: '',
    ticker: "MATIC"
};

export const CHAINS_CONFIG = {
    "0x1": Ethereum,
    "0x13881": MumbaiTestnet,
    "0x89": Polygon,
    "0xa86a": Avalanche,    
    "0x13882": PolygonAmoy
};