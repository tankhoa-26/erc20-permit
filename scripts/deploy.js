// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");
const {ethers}  = require("hardhat");

const _DECIMAL = ethers.BigNumber.from(10).pow(18);
const amountMinted = ethers.BigNumber.from(1000).mul(_DECIMAL);
const fee = ethers.BigNumber.from(10).mul(_DECIMAL);
const deadline = ethers.constants.MaxUint256;

async function getPermitSignature(
    wallet,
    token,
    spender,
    value,
    deadline,
){
    const [nonce, name, version, chainId] = await Promise.all([
        token.nonces(wallet.address),
        token.name(),
        '1',
        wallet.getChainId(),
    ])

    console.log("name-----: ", name);

    return ethers.utils.splitSignature(
        await wallet._signTypedData(
        {
            name,
            version,
            chainId,
            verifyingContract: token.address,
        },
        {
            Permit: [
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'spender',
                type: 'address',
            },
            {
                name: 'value',
                type: 'uint256',
            },
            {
                name: 'nonce',
                type: 'uint256',
            },
            {
                name: 'deadline',
                type: 'uint256',
            },
            ],
        },
        {
            owner: wallet.address,
            spender,
            value,
            nonce,
            deadline,
        }
        )
    )
}
async function main() {
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];

    //DAL Token
    const TokenPermitFactory = await ethers.getContractFactory("TokenPermit", deployer);
    const DALToken = await TokenPermitFactory.deploy();
    await DALToken.deployed();
    console.log("Deploy DAL token success");

    console.log("Mint 1000 DAL token to deployer");
    await DALToken.mint(deployer.address, amountMinted);

    //Vault contract
    const VaultFactory = await ethers.getContractFactory("Vault", deployer);
    const vault = await VaultFactory.deploy(DALToken.address);
    console.log("Deploy Vault contract success");

    const {v, r, s} = await getPermitSignature(deployer, DALToken, vault.address, fee, deadline);

    console.log("v: ", v);
    console.log("r: ", r);
    console.log("s: ", s);

    await vault.depositeWithPermit(deployer.address, fee, deadline, v, r, s);

    console.log("Vault balance: ", await DALToken.balanceOf(vault.address));
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
