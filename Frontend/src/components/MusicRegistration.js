import React, { useState } from 'react';
import { ethers } from 'ethers';
import MusicRegistry from '../contracts/MusicRegistry.json';
import { useIPFS } from '../hooks/useIPFS';

const MusicRegistration = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    collaborators: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  
  const { uploadToIPFS } = useIPFS();
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };
  
  const registerMusic = async () => {
    try {
      setLoading(true);
      
      // Upload to IPFS
      const ipfsHash = await uploadToIPFS(formData.file);
      
      // Prepare collaborators array
      const collaboratorsArray = formData.collaborators.split(',').map(c => c.trim());
      
      // Interact with smart contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      
      const contractAddress = MusicRegistry.networks[process.env.REACT_APP_NETWORK_ID].address;
      const contract = new ethers.Contract(contractAddress, MusicRegistry.abi, signer);
      
      const tx = await contract.registerMusic(
        formData.title,
        formData.artist,
        ipfsHash,
        collaboratorsArray
      );
      
      setTxHash(tx.hash);
      await tx.wait();
      
      alert('Music registered successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error registering music');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="registration-form">
      <h2>Register Your Music</h2>
      <input 
        type="text" 
        name="title"
        placeholder="Title" 
        value={formData.title} 
        onChange={handleChange} 
      />
      <input 
        type="text" 
        name="artist"
        placeholder="Artist" 
        value={formData.artist} 
        onChange={handleChange} 
      />
      <input 
        type="file" 
        name="file"
        onChange={handleChange} 
      />
      <input 
        type="text" 
        name="collaborators"
        placeholder="Collaborators (comma separated)" 
        value={formData.collaborators} 
        onChange={handleChange} 
      />
      <button onClick={registerMusic} disabled={loading}>
        {loading ? 'Registering...' : 'Register Music'}
      </button>
      {txHash && <p>Transaction Hash: {txHash}</p>}
    </div>
  );
};

export default MusicRegistration;