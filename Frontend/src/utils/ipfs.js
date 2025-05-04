import { NFTStorage, File } from 'nft.storage';


const token = 'de4ebf93.efb8b983d32c434e91593eeebd17185e';

const client = new NFTStorage({ token });

export async function uploadToIPFS(file) {
  const metadata = await client.store({
    name: file.name,
    description: 'Sound Ledger Music File',
    image: new File([file], file.name, { type: file.type }),
  });

  // Link IPFS
  return metadata.data.image.href;
}
