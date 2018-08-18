import bs58 from 'bs58';

const ipfsHashto32Bytes = hash => `0x${bs58
  .decode(hash)
  .slice(2)
  .toString('hex')}`;

const ipfs32BytestoHash = hash => bs58.encode(Buffer.from(`1220${hash.slice(2)}`, 'hex'));

export default {
  ipfsHashto32Bytes,
  ipfs32BytestoHash
};
