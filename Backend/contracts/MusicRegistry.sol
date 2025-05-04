// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MusicRegistry {
    uint public musicCount = 0;

    struct Music {
        uint id;
        string title;
        string artist;
        string ipfsHash;
        address owner;
        uint timestamp;
    }

    mapping(uint => Music) public musics;
    mapping(string => bool) public existingHashes;

    event MusicRegistered(
        uint id,
        string title,
        string artist,
        string ipfsHash,
        address indexed owner,
        uint timestamp
    );

    function registerMusic(string memory _title, string memory _artist, string memory _ipfsHash) public {
        require(!existingHashes[_ipfsHash], "Music already registered.");
        musicCount++;

        musics[musicCount] = Music(
            musicCount,
            _title,
            _artist,
            _ipfsHash,
            msg.sender,
            block.timestamp
        );

        existingHashes[_ipfsHash] = true;

        emit MusicRegistered(
            musicCount,
            _title,
            _artist,
            _ipfsHash,
            msg.sender,
            block.timestamp
        );
    }

    function getMusic(uint _id) public view returns (
        uint, string memory, string memory, string memory, address, uint
    ) {
        Music memory m = musics[_id];
        return (m.id, m.title, m.artist, m.ipfsHash, m.owner, m.timestamp);
    }
}
