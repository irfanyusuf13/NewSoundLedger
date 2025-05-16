import { useState, useEffect } from "react"; // Tambahkan useEffect di sini
import { ethers } from "ethers";
import { uploadToIPFS } from "./utils/ipfs";
import abi from "./MusicRegistry.json";
import MusicList from "./MusicList";
import { NFTStorage } from 'nft.storage'; // Tambahkan impor NFTStorage

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const testClient = new NFTStorage({
          token: 'c31149bf.bdf8c51107894918805697b861fd114d'.trim()
        })
        
        console.log("🔄 Testing koneksi NFT.Storage...")
        const status = await testClient.status()
        console.log("🟢 Status Koneksi:", status)
      } catch (error) {
        console.error("🔴 Error Koneksi:", {
          message: error.message,
          stack: error.stack
        })
      }
    }
  
    testConnection()
  }, [])

  const handleRegister = async () => {
    if (!title || !artist || !file) {
      alert("⚠️ Lengkapi semua field terlebih dahulu!");
      return;
    }
  
    try {
      console.log("🔄 Mengunggah file ke IPFS...");
      const fileHash = await uploadToIPFS(file);
      console.log("✅ File berhasil diunggah. IPFS Hash:", fileHash);
  
      if (!window.ethereum) {
        alert("❌ MetaMask tidak ditemukan. Silakan pasang dan hubungkan MetaMask.");
        return;
      }
  
      console.log("🔗 Menghubungkan ke MetaMask...");
      await window.ethereum.request({ method: "eth_requestAccounts" });
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
  
      console.log("📝 Mengirim data ke smart contract...");
      const tx = await contract.registerMusic(title, artist, fileHash);
      await tx.wait();
  
      alert("✅ Lagu berhasil didaftarkan ke blockchain!");
    } catch (err) {
      console.error("❌ Terjadi kesalahan:", err);
  
      if (err.message.includes("user rejected")) {
        alert("❌ Transaksi dibatalkan oleh pengguna.");
      } else if (err.message.includes("Music already registered")) {
        alert("⚠️ Lagu ini sudah pernah didaftarkan sebelumnya.");
      } else {
        alert(`❌ Gagal upload atau daftar ke blockchain.\nPesan: ${err.message}`);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎶 Sound Ledger</h1>
      <input placeholder="Judul Lagu" onChange={e => setTitle(e.target.value)} />
      <input placeholder="Artis" onChange={e => setArtist(e.target.value)} />
      <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleRegister}>Daftarkan Lagu</button>
      <MusicList />
    </div>
  );
}

export default App;