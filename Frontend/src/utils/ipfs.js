import { create } from 'ipfs-http-client';

const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

export async function uploadToIPFS(file) {
  try {
    const added = await client.add(file);
    return `https://ipfs.io/ipfs/${added.path}`;
  } catch (error) {
    console.error('Error uploading file: ', error);
    throw error;
  }
}

