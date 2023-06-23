import * as BABYLON from 'babylonjs';
import erc4907ABI from '../../out/ERC4907.sol/ERC4907.json';

const Web3 = require('web3');
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const web3 = new Web3(SEPOLIA_RPC_URL);

const abi = erc4907ABI.abi;
const contractAddress = "0xb0523F00227A03933daD458cED0330D9CF515E77";
const contract = new web3.eth.Contract(abi, contractAddress);

const canvas = document.getElementById('renderCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  const connectButton = document.getElementById('connect-button');

  const mintButton = document.getElementById('mint-button');

  const setUserButton = document.getElementById('set-user');

  let userAddress;

  connectButton.addEventListener('click', async () => {
    try {

      await ethereum.request({ method: 'eth_requestAccounts' });
      
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      userAddress = accounts[0];
      
      console.log(`Connected to Metamask account ${userAddress}`);
    } catch (error) {
      console.error(error);
    }
  });

  mintButton.addEventListener('click', async () => {
    try {

      const tokenId = await contract.methods.totalSupply().call();
      console.log(tokenId);

      const safeMintTx = await contract.methods.safeMint(userAddress, tokenId);

      const transactionParameters = {
        from: userAddress,
        to: contractAddress,
        data: safeMintTx.encodeABI(),
      };

      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      
      console.log(`Token minted successfully. Transaction hash: ${txHash}`);

    // Create the cube at the fixed position (0.5, 0.5, 0.5)
    const cube = BABYLON.MeshBuilder.CreateBox(`cube${tokenId}`, { size: 1 }, scene);
    cube.position = new BABYLON.Vector3(0.5, 0.5, 0.5);
    
    console.log(`Cube${tokenId} created at position: (0.5, 0.5, 0.5)`);

    // Hide the mint button after the first token is minted
    mintButton.style.display = 'none';
    } catch (error) {
      console.error('Error minting token:', error);
    }
  });

  setUserButton.addEventListener('click', async () => {
    try {

      const currentDate = new Date();
      const expirationDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
      const unixTimestamp = Math.floor(expirationDate.getTime() / 1000);

      const tokenId = await contract.methods.totalSupply().call();
      console.log(tokenId);

      const setUserTx = await contract.methods.setUser(tokenId, userAddress, unixTimestamp);

      // const setUserTx = await contract.methods.setUser(tokenId, userAddress, unixTimestamp).send({ from: userAddress });

      const transactionParameters = {
        from: userAddress,
        to: contractAddress,
        data: setUserTx.encodeABI(),
      };
      
      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log(`Land rented successfully. Transaction hash: ${txHash}`);
    } catch(error) {
      console.error(error);
    }
  });

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});