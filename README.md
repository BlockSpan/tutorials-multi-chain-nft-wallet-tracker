# MULTI CHAIN NFT WALLET TRACKER

Blockspan API offers a wealth of data about NFTs. It's a treasure trove for developers who want to build applications around NFTs, whether it's for pricing, trading, analytics, or anything else you can imagine in the NFT space.

In this guide, we will create an application that finds all NFTs owned by a particular wallet across all blockchains. The user will input only the wallet address, and see a table of all NFTs and their chain. This application will use the Blockspan Get All NFTs Of Owner API. 

## REQUIREMENTS:
- Node.js and npm installed on your system.
- Basic knowledge of React.js
- Blockspan API key

## STEP 1: SETTING UP THE REACT APP

First, we need to create a new React application. Open your terminal, navigate to the directory where you want to create your project, and run the following command:

`npx create-react-app multi-chain-nft-wallet-tracker`

This will create a new folder `multi-chain-nft-wallet-tracker` with all the necessary files and dependencies for a React application.

## STEP 2: INSTALL AXIOS

We'll be using Axios to make HTTP requests to the Blockspan API. Navigate into your new project folder and install Axios:

`cd multi-chain-nft-wallet-tracker` 
`npm install axios`

## STEP 3: WRITING THE COMPONENT

In `App.js`, we will import React, Axios, and App.css. Then we will set up necessary state variables such as contractAddress and blockchain. Replace everything in `App.js` with the following:

```
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

  // fetchNFTs function

  // useEffect function

  return (
    // JSX code
  );
}

export default App;
```

## STEP 4: FETCHING AND DISPLAYING THE DATA

We will add a function `fetchNFTs` to our component that makes a get request to the Blockspan API and sets `priceSummary` in our state:

```
// fetchNFTs function

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
```

Don't forget to replace `YOUR_BLOCKSPAN_API_KEY` with your actual key!

We will then add a use effect function to combine data from all the chains into one single array

```
// useEffect function

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
```

Our JSX code will display a form for the user to input a wallet address, and a button to view NFTs. After the data is fetched, it will be displayed in a table:

```
  return (
    // JSX code

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
```

Finally, we will enhance the user interface in the browser by replacing all code in the App.css file with the following:

```
.App {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
}

.title {
  margin-top: 20px;
  margin-bottom: 0;
  text-align: center;
}

.errorMessage {
  text-align: center;
  color: red;
  font-weight: bold;
}

.message {
  text-align: center;
}

.image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputContainer {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.inputContainer input {
  padding: 10px;
  font-size: 1em;
  width: 200px;
}

.inputContainer button {
  padding: 10px;
  font-size: 1em;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}

.inputContainer button:hover {
  background-color: #0056b3;
}

.imageContainer {
  display: flex;
  justify-content: center;
  width: 100%; 
}

.imageContainer img {
  width: 100%; 
  max-width: 150px;
  height: auto; 
}
.nftData {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.nftData .image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nftData h2 {
  margin: 10px 0;
}

.nftData p {
  font-size: 1.2em;
  font-weight: bold;
}

td {
  padding: 10px;
  text-align: left;
}

th {
  padding: 10px;
  text-align: left;
}

.tableContainer {
  display: flex;
  justify-content: center;
}
```

## STEP 5: RUNNING THE APPLICATION

Now, you can start your application by running `npm start` in your terminal. You should see the following in the browser:

- Text box for wallet address
- A blue view NFTs button

Input the wallet address you want to check, and click the view NFTs button. You should then see a table with multiple NFT images and what chain they belong to. 

This wraps up our guide to creating an NFT Price Dashboard tool using the Blockspan API and React.js. Happy coding!

## CONCLUSION

Congratulations! You've just built a simple yet powerful NFT finder tool using the Blockspan API and React.js. As you've seen, the Blockspan API is intuitive to use and provides detailed and accurate information, making it a perfect choice for this kind of application. This tutorial is just a starting point - there are many ways you can expand and improve your tool. For example, you could add more error checking, improve the UI, or retrieve more NFT data.

As the world of NFTs continues to grow and evolve, tools like this will become increasingly important. Whether you're an NFT enthusiast, a developer, or a startup, understanding NFTs is a valuable skill. We hope you found this tutorial helpful.
