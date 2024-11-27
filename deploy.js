async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Deploy CrossChainToken
    const CrossChainToken = await ethers.getContractFactory("CrossChainToken");
    const token = await CrossChainToken.deploy();
    await token.deployed();
  
    console.log("CrossChainToken deployed to:", token.address);
  
    // Deploy BridgeContract with CrossChainToken address
    const BridgeContract = await ethers.getContractFactory("BridgeContract");
    const bridge = await BridgeContract.deploy(token.address);
    await bridge.deployed();
  
    console.log("BridgeContract deployed to:", bridge.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  