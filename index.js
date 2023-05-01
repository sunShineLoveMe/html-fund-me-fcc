import { ethers } from "./ethers-5.6.esm.min.js";
import { abi,contractAddress } from "./constants.js";

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')
const balanceButton = document.getElementById('balanceButton')
const withdrawButton = document.getElementById('withdrawButton')

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if(typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        document.getElementById('connectButton').innerHTML = 'Connected';
    } else {
        // console.log('Please install MetaMask!');
        document.getElementById('connectButton').innerHTML = 'Please install MetaMask!';
    }
}

async function getBalance() {
    if(typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(`Balance: ${ethers.utils.formatEther(balance)}`)
    }
}

async function fund() {
    // console.log(`Funding with ${ethAmount}`)
    // console.log(`Funding with `)
    const ethAmount = document.getElementById('ethAmount').value
    if(typeof window.ethereum !== "undefined") {
        /**
         * 1. provider: connection to the blockchain
         * 2. signer: wallet someone with some gas
         * 3. contract that we are interacting with 
         * 4. ABI Address
         */
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount)
            })
            listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
        // console.log(`signer: ${signer}`)
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    /**
     * provider.once: 只监听一次事件
     * provider.on: 持续监听事件
     */

    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`);
            resolve();
        })
    })
    // return new Promise();
}

async function withdraw() {
    if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}