/* import React, { Component } from 'react';
import Storage from '../abis/Storage.json'
import './App.css';
import  Web3 from 'web3' ;

import Download from "./Download";
import Upload from "./Upload";
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


class App extends Component {
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
    constructor(props) {
        super(props);
        this.state={
         account :'',
         contract : null,
         buffer: null ,
         fileHash: null };
    }
    async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
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
            if(error) {
                console.error(error)
                return
            }
            this.state.contract.methods.upload(result[0].hash).send({ from: this.state.account }).then((r) => {
                return this.setState({ fileHash: result[0].hash })
            })
                // The address of your files.
                // const addr = 'https://ipfs.infura.io/ipfs/'+result[0].hash

                // ipfs.name.publish(addr, function (err, res) {
                //     // You now receive a res which contains two fields:
                //     //   - name: the name under which the content was published.
                //     //   - value: the "real" address to which Name points.
                //     console.log(`https://ipfs.infura.io/ipns/file1`)
                // })


        });


    };

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"

            target="_blank"
            rel="noopener noreferrer"
          >
            RSA Storage
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">

                <Upload />
                <Download fileHash={`${this.state.fileHash}`}/>



            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App; */

import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Storage from '../abis/Storage.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 
var FileSaver = require('file-saver');
class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Storage.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Storage.abi, networkData.address)
      this.setState({ contract })
      const fileHash = await contract.methods.download().call()
      this.setState({ fileHash })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      fileHash: '',
	  fileName: '' ,
      contract: null,
      web3: null,
      buffer: null,
      account: null
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
	const name = event.target.files[0].name 
    const lastDot = name.lastIndexOf('.');

    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);

    this.setState({ fileName: fileName })
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })

      console.log('buffer', this.state.buffer)
    }
  }
  onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
       this.state.contract.methods.upload(result[0].hash).send({ from: this.state.account }).then((r) => {
         return this.setState({ fileHash: result[0].hash })
       })
    })
  }
httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
 downloading =(event) =>{
 event.preventDefault()
FileSaver.saveAs(new Blob([this.httpGet('https://ipfs.infura.io/ipfs/'+this.state.fileHash)]),this.state.fileName);


	 }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
           
            target="_blank"
            rel="noopener noreferrer"
          >
            RSA Storage
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">

                <p>&nbsp;</p>
                <h2>Upload file</h2>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit' />
                </form>
				
				<h2> your files </h2>
				
				<ul><li>{this.state.fileName}</li><button onClick={this.downloading}>download</button></ul>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
