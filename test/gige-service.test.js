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

    /* const event = service.OrderAccepted();
    await event.watch((err, res) => {
      console.log(err);
      orderId = res.args.id.toString(10);
      eventEmitted = true;
    }); */

    const amount = web3.toWei(2, 'ether');

    const bobBalanceBefore = await web3.eth.getBalance(bob).toNumber();
    const balanceLockedBefore = await service.balanceLocked.call(bob);

    await service.acceptOrder(orderId, { from: bob, value: amount });

    const bobBalanceAfter = await web3.eth.getBalance(bob).toNumber();

    const result = await service.fetchOrder.call(orderId);

    const balanceLocked = await service.balanceLocked.call(bob);

    assert.equal(result[4], bob, 'the buyer address should be set bob when he purchases an item');
    // assert.equal(eventEmitted, true, 'accepting an order should emit a OrderAccepted event');
    assert.equal(
      parseInt(balanceLocked, 10),
      parseInt(balanceLockedBefore, 10) + parseInt(price, 10),
      "bob's balance locked should be increased by the price of the order"
    );
    assert.isBelow(
      bobBalanceAfter,
      bobBalanceBefore - price,
      "bob's balance should be reduced by more than the price of the order (including gas costs)"
    );
    assert.equal(
      result[5].toString(10),
      1,
      'the state of the order should be "Accepted", which should be declared second in the OrderState Enum'
    );
  });
  /*it('should allow the seller to cancel a order', async () => {
    const service = await GigEService.deployed();

    let eventEmitted = false;

    const event = service.OrderCancel();
    await event.watch((err, res) => {
      console.log(err);
      orderId = res.args.id.toString(10);
      eventEmitted = true;
    });

    const bobBalanceBefore = await web3.eth.getBalance(bob).toNumber();
    const balanceLockedBefore = await service.balanceLocked.call(bob);

    await service.cancelOrder(orderId, { from: alice });

    const bobBalanceAfter = await web3.eth.getBalance(bob).toNumber();

    const result = await service.fetchOrder.call(orderId);

    const balanceLocked = await service.balanceLocked.call(bob);

    //assert.equal(eventEmitted, true, 'accepting an order should emit a OrderCancel event');
    assert.equal(
      parseInt(balanceLocked, 10),
      parseInt(balanceLockedBefore, 10) - parseInt(price, 10),
      "bob's balance locked should be decreased by the price of the order"
    );
    assert.isAbove(
      bobBalanceAfter,
      bobBalanceBefore,
      "bob's balance should be increased by the price of the order (minus gas costs)"
    );
    assert.equal(
      result[5].toString(10),
      3,
      'the state of the order should be "Cancel", which should be declared fourth in the OrderState Enum'
    );
  });*/
  it('should allow the seller to mark order as finished', async () => {
    const service = await GigEService.deployed();

    let eventEmitted = false;

    const event = service.OrderFinished();
    await event.watch((err, res) => {
      orderId = res.args.id.toString(10);
      eventEmitted = true;
    });

    await service.finishOrder(orderId, { from: alice });

    const result = await service.fetchOrder.call(orderId);

    assert.equal(
      result[5].toString(10),
      4,
      'the state of the order should be "Finished", which should be declared fifth in the OrderState Enum'
    );
    // assert.equal(eventEmitted, true, 'accepting an order should emit a OrderFinish event');
  });
  it('should allow the buyer to mark order as approve and release the funds to the seller', async () => {
    const service = await GigEService.deployed();

    let eventEmitted = false;

    const event = service.OrderApproved();
    await event.watch((err, res) => {
      orderId = res.args.id.toString(10);
      eventEmitted = true;
    });
    const balanceAvailableBefore = await service.balanceAvailable.call(alice);
    const balanceLockedBefore = await service.balanceLocked.call(bob);
    await service.releaseOrder(orderId, { from: bob });
    const balanceAvailable = await service.balanceAvailable.call(alice);
    const balanceLocked = await service.balanceLocked.call(bob);
    const result = await service.fetchOrder.call(orderId);

    assert.equal(result[4], bob, 'the buyer address should be set bob when he release an order');
    assert.equal(
      parseInt(balanceAvailable, 10),
      parseInt(balanceAvailableBefore, 10) + parseInt(price, 10),
      "alice's balance allowed should be increased by the price of the order"
    );
    assert.equal(
      parseInt(balanceLocked, 10),
      parseInt(balanceLockedBefore, 10) - parseInt(price, 10),
      "bob's balance allowed should be decreased by the price of the order"
    );
    assert.equal(
      result[5].toString(10),
      5,
      'the state of the order should be "Approved", which should be declared six in the OrderState Enum'
    );
    //assert.equal(eventEmitted, true, 'accepting an order should emit a OrderApproved event');
  });
  it('should allow the seller withdraw available funds', async () => {
    const service = await GigEService.deployed();

    let eventEmitted = false;

    const event = service.Withdrawn();
    await event.watch((err, res) => {
      eventEmitted = true;
    });
    const balanceAvailableBefore = await service.balanceAvailable.call(alice);
    const balanceAliceBefore = await web3.eth.getBalance(alice).toNumber();
    await service.withdrawPayments({ from: alice });
    const balanceAvailable = await service.balanceAvailable.call(alice);
    const balanceAliceAfter = await web3.eth.getBalance(alice).toNumber();

    assert.equal(parseInt(balanceAvailable, 10), 0, 'balance available should be 0');
    assert.isAbove(
      parseInt(balanceAvailableBefore),
      parseInt(balanceAvailable),
      'balance available before should be greater than balance available after'
    );
    assert.isAbove(
      parseInt(balanceAliceAfter),
      parseInt(balanceAliceBefore),
      "alice's balance after should be greater than alice's balance before"
    );
    // assert.equal(eventEmitted, true, 'pulling funds should emit a Withdrawn event');
  });
});
