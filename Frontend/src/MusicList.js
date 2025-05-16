import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './MusicRegistry.json';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function MusicList() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
        const count = await contract.songCount();
        const songsArray = [];
        for (let i = 0; i < count; i++) {
          const song = await contract.songs(i);
          songsArray.push(song);
        }
        setSongs(songsArray);
      }
    };
    fetchSongs();
  }, []);

  return (
    <div>
      <h2>Daftar Lagu</h2>
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            <p>Judul: {song.title}</p>
            <p>Artis: {song.artist}</p>
            <p>Genre: {song.genre}</p>
            <p>Tanggal Rilis: {song.releaseDate}</p>
            <p>Label: {song.label}</p>
            <p>
              File: <a href={song.ipfsHash} target="_blank" rel="noopener noreferrer">Link</a>
            </p>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MusicList;
