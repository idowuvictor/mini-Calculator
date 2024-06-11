import {useState, useEffect} from "react";
import {ethers} from "ethers";
import Calculator_abi from "../artifacts/contracts/Calculator.sol/Calculator.json";

export default function HomePage() {

  const inputBox = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid blue',


  };

  const btn = {
    backgroundColor: 'blue',
    color: 'white',
    fontSize: '18px',
    border: 'none',
    fontWeight: 'bold',
    padding: '10px',
    borderRadius: '5px',
    margin: '5px'
  };



  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [calculator, setCalculator] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [addNum1, setAddNum1] = useState('');
  const [addNum2, setAddNum2] = useState('');
  const [subNum1, setSubNum1] = useState('');
  const [subNum2, setSubNum2] = useState('');
  const [mulNum1, setMulNum1] = useState('');
  const [mulNum2, setMulNum2] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [error, setError] = useState(undefined);
  const [success, setSuccess] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const calculatorABI = Calculator_abi.abi;



  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account[0]);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account[0]);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getcalculatorcontract();
  };

  const getcalculatorcontract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, calculatorABI, signer);
 
    setCalculator(atmContract);
    console.log("Calculator contract: " );
  }

  const getBalance = async() => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    if (calculator) {
      console.log(calculator, "Calculator contract: " );
      console.log("Account: ", ethers.utils.formatEther(await provider.getBalance(account)));
      setBalance(parseFloat(ethers.utils.formatEther(await provider.getBalance(account))).toFixed(2));
    }
    
  }

  const addNum = async() => {
    setSuccess(undefined);
    setError(undefined);
    if (calculator) {
      try {
        let result = await calculator.add(addNum1, addNum2);
        setSuccess(`Result: ${result.toString()}`)
        setAddNum1('');
        setAddNum2('');
      } catch (error) {
        console.log(error);
        setError(error.message.split(":")[0]);
      }
    }
  }

  const subNum = async() => {
    setSuccess(undefined);
    setError(undefined);
    if (calculator) {
      try {
        let result = await calculator.sub(subNum1, subNum2);
        setSuccess(`Result: ${result.toString()}`)
        setSubNum1('');
        setSubNum2('');
      } catch (error) {
        const reason = error.reason || error.data?.message || "Transaction reverted";
        setError(reason);
      }
    }
  }


  const multiply = async() => {
    setSuccess(undefined);
    setError(undefined);
    if (calculator) {
      try {
        let result = await calculator.multiply(mulNum1, mulNum2);
        setSuccess(`Result: ${result.toString()}`)
        setMulNum1('');
        setMulNum2('');
      } catch (error) {
        console.log(error);
        setError(error.message.split(":")[0]);
      }
    }
  }

  const changeOwner = async() => {
    setSuccess(undefined);
    setError(undefined);
    if (calculator) {
      try {
        let tx = await calculator.transferOwnership(newOwner);
        await tx.wait()
        setSuccess("Owner changed successfully")
      } catch (error) {
        console.log(error);
        setError(error.message.split(":")[0]);
      }
    }
  }

  const getOwner = async() => {
    setSuccess(undefined);
    setError(undefined);
    if (calculator) {
      try {
        let tx = await calculator.owner();
        setSuccess(tx)
      } catch (error) {
        console.log(error);
        setError("error");
      }
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this calculator.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account.slice(0, 6) + "..." + account.slice(-4)}</p>
        <p>Your Balance: {balance}</p>                
        
        {/* result of the operation */}
        <div>
                { success ? <p style={{color: 'green'}}>{success}</p> : <p style={{color:  "red"}}>{error}</p> }
         </div>


            {/* //add numbers */}
              <div>
                <div className="">
                  <input id="addNum1" type="text" style={inputBox} placeholder="first number" value={addNum1}
                  onChange={(e) => setAddNum1(e.target.value)} required />

                  <input id="addNum2" type="text" style={inputBox} placeholder="second number" value={addNum2}
                  onChange={(e) => setAddNum2(e.target.value)} required />

                <span className>
                  <button onClick={addNum} style={btn}>Add Number</button>
                </span>
                </div>
              </div>

              {/* //subtract numbers */}
              <div>
                <div className="">
                  <input id="subNum1" type="text" style={inputBox} placeholder="first number" value={subNum1}
                  onChange={(e) => setSubNum1(e.target.value)} required />

                  <input id="subNum2" type="text" style={inputBox} placeholder="second number" value={subNum2}
                  onChange={(e) => setSubNum2(e.target.value)} required />

                <span className>
                  <button onClick={subNum} style={btn}>Subtract Number</button>
                </span>
                </div>
              </div>
                
              {/* //multiply numbers */}
              <div>

                <div className="">
                  <input id="mulNum1" type="text" style={inputBox} placeholder="first number" value={mulNum1}
                  onChange={(e) => setMulNum1(e.target.value)} required />

                  <input id="mulNum2" type="text" style={inputBox} placeholder="second number" value={mulNum2}
                  onChange={(e) => setMulNum2(e.target.value)} required />

                <span className>
                  <button onClick={multiply} style={btn}>Multiply Number</button>
                </span>
                </div>
              </div>

              {/* //change owner */}
              <div>
                <div className="">
                  <input id="newOwner" type="text" style={inputBox} placeholder="new owner address" value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)} required />

                <span className>
                  <button onClick={changeOwner} style={btn}>Change Owner</button>
                </span>
                </div>
              </div>


              <br/>

              {/* //get owner */}
              <div>
                <div className="">
                <span className>
                  <button onClick={getOwner} style={btn}>Get Owner</button>
                </span>
                </div>
              </div>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to my Mini Calculator!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}