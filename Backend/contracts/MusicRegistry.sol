// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MusicRegistry {
    struct Song {
        string title;
        string artist;
        string genre;
        string releaseDate;
        string label;
        string ipfsHash;
    }

    mapping(uint256 => Song) public songs;
    uint256 public songCount;

    function registerMusic(
        string memory _title,
        string memory _artist,
        string memory _genre,
        string memory _releaseDate,
        string memory _label,
        string memory _ipfsHash
    ) public {
        songs[songCount] = Song(_title, _artist, _genre, _releaseDate, _label, _ipfsHash);
        songCount++;
    }
}
