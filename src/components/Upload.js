import React, { Component } from 'react';

import Storage from '../abis/Storage.json'
import './App.css';
import  Web3 from 'web3' ;
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
class Upload extends Component {
    async componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
    }
    async loadBlockchainData(){
        const web3 = window.web3
        const accounts =await web3.eth.getAccounts() ;
        this.setState({account :accounts[0]})
        console.log(accounts)
        const networkId = await web3.eth.net.getId()
        const networkData = Storage.networks[networkId]
        if(networkData){
            const abi = Storage.abi
            const address = networkData.address
            const contract = web3.eth.Contract(abi,address)
            this.setState({contract : contract })
            console.log(contract)
            const fileHash = await contract.methods.download().call()
            this.setState({fileHash})
        }else{

            window.alert('contract is not deployed to this network')
        }
    }
    constructor() {
        super();
        this.state={
            account :'',
            contract : null,
            buffer: null ,
            fileHash: null };
    }
    async loadWeb3() {
        if (window.ethereum){
            window.web3= new Web3(window.ethereum)
            await window.ethereum.enable()
        } if(window.web3){
            window.web3= new Web3("ws://127.0.0.1:7545")
        }else {
            window.alert('Please use Metamask !')
        }
    }
    captureFile = (event) => {
        event.preventDefault()
        const file =event.target.files[0] ;
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file)
        reader.onloadend=()   =>  {
            this.setState(
                {buffer : Buffer(reader.result)}
            )
        }


    };

    //Qma3cYYu7mFAUG5w15wNhAc23Cy62q9LJaCPWFwLK6ioXQ
    // https://ipfs.infura.io/ipfs/Qma3cYYu7mFAUG5w15wNhAc23Cy62q9LJaCPWFwLK6ioXQ
    onSubmit = async (event) => {
        event.preventDefault()
        ipfs.add(this.state.buffer, (error, result) => {
            if(error){ console.error(error);}
            if(result) {
                console.log("IPFS result", result[0].hash);
                /* this.setState({fileHash:result[0].hash}); */
                this.state.contract.methods.upload(this.state.fileHash).call()
				
            }
            return ;
        });


    };

    render() {
        return (
            <div name="upload"><h1>UPLOAD</h1>
                <form onSubmit={this.onSubmit}>
                    <input type="file" onChange={this.captureFile}/>
                    <input type="submit" value="submit"/>
                </form>
            </div>
        );
    }
    
}

export default Upload;
