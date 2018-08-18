import IPFS from 'ipfs-api';

const ipfs = new IPFS('localhost', '5001', { protocol: 'http' });

export default ipfs;
