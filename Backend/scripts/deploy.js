const hre = require("hardhat");

async function main() {
  const MusicRegistry = await hre.ethers.getContractFactory("MusicRegistry");
  const registry = await MusicRegistry.deploy();

  // Tunggu transaksi deploy selesai
  await registry.waitForDeployment();

  console.log(`✅ MusicRegistry deployed to: ${await registry.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
