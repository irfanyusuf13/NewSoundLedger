import { useState } from "react";
import { ethers } from "ethers";
import { uploadToIPFS } from "./utils/ipfs";
import abi from "./MusicRegistry.json";

const CONTRACT_ADDRESS = "";

function App() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);

  const handleRegister = async () => {
    if (!title || !artist || !file) {
      alert("Lengkapi semua field!");
      return;
    }

    try {
      const fileHash = await uploadToIPFS(file);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);

      const tx = await contract.registerMusic(title, artist, fileHash);
      await tx.wait();

      alert("✅ Lagu berhasil didaftarkan ke blockchain!");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal upload atau daftar ke blockchain.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎶 Sound Ledger</h1>
      <input placeholder="Judul Lagu" onChange={e => setTitle(e.target.value)} />
      <input placeholder="Artis" onChange={e => setArtist(e.target.value)} />
      <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleRegister}>Daftarkan Lagu</button>
    </div>
  );
}

export default App;
