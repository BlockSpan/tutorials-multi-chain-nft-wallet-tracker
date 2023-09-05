import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [NFTs, setNFTs] = useState([]);
  const [chainArray, setChainArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasClicked, setHasClicked] = useState(false);

  const blockchains = ['eth-main', 'arbitrum-main', 'optimism-main', 'poly-main', 'bsc-main', 'eth-goerli'];
  const [ethNFTs, setEthNFTs] = useState(null);
  const [arbitrumNFTs, setArbitrumNFTs] = useState(null);
  const [optimismNFTs, setOptimismNFTs] = useState(null);
  const [polyNFTs, setPolyNFTs] = useState(null);
  const [bscNFTs, setBscNFTs] = useState(null);
  const [goerliNFTs, setGoerliNFTs] = useState(null);

  const fetchNFTs = async () => {
    setEthNFTs(null);
    setArbitrumNFTs(null);
    setOptimismNFTs(null);
    setPolyNFTs(null);
    setBscNFTs(null);
    setGoerliNFTs(null);
    setNFTs([]);
    setIsLoading(true); 
    setError(true);
    setHasClicked(true);

    const fetchPromises = blockchains.map(async (blockchain) => {
      try {
        const options = {
          method: 'GET',
          url: `https://api.blockspan.com/v1/nfts/owner/${walletAddress}?chain=${blockchain}&include_nft_details=true&page_size=25`,
          headers: {
            accept: 'application/json',
            'X-API-KEY': 'YOUR_BLOCKSPAN_API_KEY',
          },
        };
        const response = await axios.request(options);
        switch (blockchain) {
          case 'eth-main':
            await setEthNFTs(response.data.results);
            break;
          case 'arbitrum-main':
            await setArbitrumNFTs(response.data.results);
            break;
          case 'optimism-main':
            await setOptimismNFTs(response.data.results);
            break;
          case 'poly-main':
            await setPolyNFTs(response.data.results);
            break;
          case 'bsc-main':
            await setBscNFTs(response.data.results);
            break;
          case 'eth-goerli':
            await setGoerliNFTs(response.data.results);
            break;
          default:
            break;
        }
        setError(false)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Invalid blockspan API key!');
        } else {
          setError('No NFTs found in this wallet!');
        }
        console.error('Error fetching collections:', error);
      }
    })
    await Promise.all(fetchPromises);
    setIsLoading(false); 
  };

  useEffect(() => {
    let updatedNFTs = [];
    let updatedChainArray = [];

    if (ethNFTs !== null) {
      updatedNFTs = updatedNFTs.concat(ethNFTs);
      updatedChainArray = updatedChainArray.concat(Array(ethNFTs.length).fill('eth-main'));
    }
    if (arbitrumNFTs !== null) {
      updatedNFTs = updatedNFTs.concat(arbitrumNFTs);
      updatedChainArray = updatedChainArray.concat(Array(arbitrumNFTs.length).fill('arbitrum-main'));
    }
    if (optimismNFTs !== null) {
      updatedNFTs = updatedNFTs.concat(optimismNFTs);
      updatedChainArray = updatedChainArray.concat(Array(optimismNFTs.length).fill('optimism-main'));
    }
    if (polyNFTs !== null) {
      updatedNFTs = updatedNFTs.concat(polyNFTs);
      updatedChainArray = updatedChainArray.concat(Array(polyNFTs.length).fill('poly-main'));
    }
    if (bscNFTs !== null) {
      updatedNFTs = updatedNFTs.concat(bscNFTs);
      updatedChainArray = updatedChainArray.concat(Array(bscNFTs.length).fill('bsc-main'));
    }
    if (goerliNFTs !== null) {
      updatedNFTs = updatedNFTs.concat(goerliNFTs);
      updatedChainArray = updatedChainArray.concat(Array(goerliNFTs.length).fill('goerli-main'));
    }

    setNFTs(updatedNFTs);
    setChainArray(updatedChainArray);
  }, [ethNFTs, arbitrumNFTs, optimismNFTs, polyNFTs, bscNFTs, goerliNFTs]);

  return (
    <div className="App">
      <h1 className="title">Multi Chain NFT Wallet Tracker</h1>
      <p>Input wallet address below to see all NFT assets accross all chains.</p>
      <div className="inputContainer">
        <input
          type="text"
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <button onClick={fetchNFTs}>View NFTs</button>
      </div>
      {isLoading ? ( 
        <p className="loadingMessage">Loading NFTs...</p>
      ) : error && hasClicked && NFTs.length === 0? (
        <p className="errorMessage">{error}</p>
      ) : NFTs.length !== 0 && (
        <table>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>NFT Number</th>
              <th>Chain</th>
              <th>Contract Address</th>
              <th>Token ID</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {NFTs.map((nft, index) => (
              <tr style={{ backgroundColor: '#f2f2f2' }} key={index}>
                <td>{index + 1}</td>
                <td>{chainArray[index]}</td>
                <td>{nft.contract_address}</td>
                <td>{nft.id}</td>
                <td>
                  <div className="imageContainer">
                    {nft.nft_details.cached_images && nft.nft_details.cached_images.medium_500_500 ? (
                      <img className="image" src={nft.nft_details.cached_images.medium_500_500} alt={nft.nft_details.name} />
                    ) : (
                      <div className="message">Image not available.</div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
