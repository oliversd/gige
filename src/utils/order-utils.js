const States = [
  'Waiting for payment',
  'Accepted',
  'Rejected',
  'Canceled',
  'Finished',
  'Approved',
  'In arbitrage',
  'Arbitrage resolved'
];

const OrderState = state => States[state];

export default OrderState;
