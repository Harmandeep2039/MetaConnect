import Web3 from'web3';
import { PROXY_CONTRACT_ADDRESS } from './Constants';
import ABIContract from './ERC20Token.json'
const callWeb3 = async () => {
    let web3ObjectCall = '';
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
        web3ObjectCall = new Web3(ethereum);
        return (web3ObjectCall);
    } else if (window.web3) {
        web3ObjectCall = new Web3(window.web3.currentProvider);
        return (web3ObjectCall);
    } else {
        return (new Error("You have to install MetaMask!"));
    }
};


const callContract = async ()=>{
    const web3Object=await callWeb3();
    // console.log(PROXY_CONTRACT_ADDRESS);
    const contractObject=new web3Object.eth.Contract(ABIContract,PROXY_CONTRACT_ADDRESS)
    return(contractObject);   
}

// console.log(callContract);
export const balanceOf = async (address) => {
    try {
        const contract = await callContract();
        const balance =  await contract.methods
        .balanceOf(address)
        .call()
        // console.log("balance:",balance);
        const b= await decimals();
        const value=(balance/10**b);
        console.log(value);
        return balance;
    } catch (error) {
        console.log("Balance Of",error);
        return error;
    }
};
export const decimals= async()=>{
    try {
        const contract=await callContract();
        const decimals=await contract.methods
        .decimals()
        .call()
        console.log("Decimals", decimals);
        return decimals
    }
    catch(error) {
        return error
    }
}
const calculateGasPrice = async () => {
    const web3 = await callWeb3();
    return web3.eth.getGasPrice();
}
export const approve = async (owner, sender) => {

    // console.log("PROXY_CONTRACT_ADDRESS", PROXY_CONTRACT_ADDRESS)
    const contract = await callContract(PROXY_CONTRACT_ADDRESS);
    const gasPrice = await calculateGasPrice();
    const gas = await contract.methods
        .approve(sender, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
        .estimateGas({ from: owner});

    return await contract.methods
        .approve(sender, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
        .send({ from:owner, gas, gasPrice })
        .then(async responce => {
            return (true);
        })
        .catch(error => {

            return (error)
        });
};
export const transfer=async(owner1,sender1)=>{
    const contract = await callContract(PROXY_CONTRACT_ADDRESS);
    const gasPrice = await calculateGasPrice();
    // const ab=await balanceOf();
    const gas = await contract.methods
        .transfer(sender1, (1*10**10).toFixed(0))
        .estimateGas({ from: owner1});

    return await contract.methods
        .transfer(sender1, (1*10**10).toFixed(0))
        .send({ from:owner1, gas, gasPrice })
        .then(async responce => {
            return (true);
        })
        .catch(error => {
console.log("Error",error);
            return (error)
        });
}