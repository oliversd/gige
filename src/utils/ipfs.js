import IPFS from 'ipfs-api';
import config from '../config/contract';

const ipfs = new IPFS(config.ipfs.host, config.ipfs.port, {
  protocol: config.ipfs.protocol
});

export default ipfs;
