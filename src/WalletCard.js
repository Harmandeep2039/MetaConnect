import React, {useState} from 'react'
import {ethers} from 'ethers'
// import Web3 from'web3';
import { approve, balanceOf, decimals, transfer } from './TokenService';
const WalletCard = () => {

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [userDeimal, setUserDecimal] = useState(null);
    const [sendAddress, setSendAddress]= useState('');

	async function connectWalletHandler(){
		if (window.ethereum && window.ethereum.isMetaMask) {
            // console.log("Account:",defaultAccount);
			// const a=await balanceOf(defaultAccount)
			// setUserDecimal(a);
			// await approve();
			// await transfer();
			console.log('MetaMask Here!');
    

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
				getAccountBalance(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}
	async function sendMoney() {
		    await approve(defaultAccount, sendAddress);
			await transfer(defaultAccount, sendAddress);
	}

	// update account, will cause component re-render
	const accountChangedHandler = async (newAccount) => {
        const a=await balanceOf(newAccount)
		console.log("Balance:",a);
			setUserDecimal(a);
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	}
	const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);
	
	return (
		<div className='walletCard'>
		<h4> {"Connection to MetaMask using window.ethereum methods"} </h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div className='accountDisplay'>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<div className='balanceDisplay'>
				<h3>Balance: {userBalance}</h3>
			</div>
			<div className='balanceDisplay'>
				<h3>value: {userDeimal}</h3>
			</div>
			<div>
			<button onClick={sendMoney}> Transfer</button>
			</div>
            <div>
                <input type="text" placeholder="address" value={sendAddress} onChange={(e)=>{setSendAddress(e.target.value)}}/>
            </div>
			{errorMessage}
		</div>
	);
}

export default WalletCard;