const GigEService = artifacts.require('GigEService');

contract('GigEService', accounts => {
  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const emptyAddress = '0x0000000000000000000000000000000000000000';

  let serviceId;
  let orderId;

  const price = web3.toWei(1, 'ether');

  it('should create a service with minimumPrice, seller address and IPFS hash', async () => {
    const service = await GigEService.deployed();

    let eventEmitted = false;

    const event = service.ServiceCreated();
    await event.watch((err, res) => {
      serviceId = res.args.id.toString(10);
      eventEmitted = true;
    });

    const data = '0x4d71d4e5e54a5483ca5f6151547227581f90668e25585fdd2f566a03711025b4';

    await service.createService(price, data, { from: alice });

    const result = await service.fetchService.call(serviceId);

    assert.equal(
      result[0],
      serviceId,
      'the id of the last added service does not match the expected value'
    );
    assert.equal(
      result[1].toString(10),
      price,
      'the price of the last added service does not match the expected value'
    );
    assert.equal(
      result[2],
      data,
      'the data of the last added service does not match the expected value'
    );
    assert.equal(
      result[3],
      alice,
      'the address creating the service should be listed as the seller'
    );
    assert.equal(eventEmitted, true, 'adding an service should emit a ServiceCreated event');
  });

  it('should create an order with price, seller address, buyer address and state as proposal', async () => {
    const service = await GigEService.deployed();

    let eventEmitted = false;

    const event = service.OrderProposal();
    await event.watch((err, res) => {
      orderId = res.args.id.toString(10);
      eventEmitted = true;
    });

    await service.createOrder(serviceId, price, bob, { from: alice });

    const result = await service.fetchOrder.call(orderId);

    const sellerOrders = await service.getOrdersFromSeller.call(alice, { from: alice });

    assert.equal(
      result[0],
      orderId,
      'the id of the last added order does not match the expected value'
    );
    assert.equal(
      result[1],
      serviceId,
      'the id of the last added order does not match the expected value'
    );
    assert.equal(
      result[2].toString(10),
      price,
      'the price of the last added order does not match the expected value'
    );
    assert.equal(result[3], alice, 'the address creating the order should be listed as the seller');
    assert.equal(result[4], bob, 'the address of the buyer does not match the expected value');
    assert.equal(result[5].toString(10), 0, 'the state of the order should be Proposal');
    assert.equal(eventEmitted, true, 'adding an order should emit a ServiceCreated event');
    assert.equal(sellerOrders.length, 1, 'sellerOrders length should be 1');
  });

  it('should allow the buyer to accept and pay an order', async () => {
    const service = await GigEService.deployed();

    let eventEmitted = false;

    const event = service.OrderAccepted();
    await event.watch((err, res) => {
      orderId = res.args.id.toString(10);
      eventEmitted = true;
    });

    const amount = web3.toWei(2, 'ether');

    const aliceBalanceBefore = await web3.eth.getBalance(alice).toNumber();
    const bobBalanceBefore = await web3.eth.getBalance(bob).toNumber();

    await service.acceptOrder(orderId, { from: bob, value: amount });

    const aliceBalanceAfter = await web3.eth.getBalance(alice).toNumber();
    const bobBalanceAfter = await web3.eth.getBalance(bob).toNumber();

    const result = await service.fetchOrder.call(orderId);

    assert.equal(
      result[5].toString(10),
      1,
      'the state of the order should be "Accepted", which should be declared second in the OrderState Enum'
    );
    assert.equal(result[4], bob, 'the buyer address should be set bob when he purchases an item');
    assert.equal(eventEmitted, true, 'accepting an order should emit a OrderAccepted event');
    assert.equal(
      aliceBalanceAfter,
      aliceBalanceBefore + parseInt(price, 10),
      "alice's balance should be increased by the price of the order"
    );
    assert.isBelow(
      bobBalanceAfter,
      bobBalanceBefore - price,
      "bob's balance should be reduced by more than the price of the order (including gas costs)"
    );
  });
});
