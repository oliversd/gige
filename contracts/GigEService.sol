pragma solidity ^0.4.24;

import "zeppelin/contracts/lifecycle/Destructible.sol";
import "zeppelin/contracts/lifecycle/Pausable.sol";
import "zeppelin/contracts/math/SafeMath.sol";

contract GigEService is Destructible, Pausable {
    using SafeMath for uint256;

    uint256 public serviceId;
    uint256 public orderId;
    uint256[] public serviceList;
    uint256[] public orderList;

    /**
    * OrderState
    * Proposal: The seller create a order with the price agreed with the customer
    * Accepted: The customer accepts the proposal and deposit the payment into the escrow
    * Rejected: The customer rejects the proposal
    * Cancel: The seller cancel the service the funds are returned to the customer
    * Finished: The seller mark the service as finished
    * Approved: The customer approve the job and release the payment
    * Arbitrage: There is a problem and the order is on Arbitrage
    * Resolved: Arbitrage result
     */
    enum OrderState { Proposal, Accepted, Rejected, Cancel, Finished, Approved, Arbitrage, Resolved }

    event ServiceCreated(uint256 id);
    event OrderProposal(uint256 id);
    event OrderAccepted(uint256 id);
    event OrderRejected(uint256 id);
    event OrderCancel(uint256 id);
    event OrderFinished(uint256 id);
    event OrderApproved(uint256 id);
    event OrderArbitrage(uint256 id, address applicant);
    event OrderResolved(uint256 id, bool result);
    event Withdrawn(address indexed payee, uint256 weiAmount);
    
    struct Service {
        uint256 id;
        uint256 minimumPrice;
        address seller;
        bytes32 data;
    }
    
    struct Order {
        uint256 id;
        uint256 serviceId;
        uint256 price;
        address seller;
        address buyer;
        OrderState state;
    }
    
    // serviceId => Service
    mapping (uint256 => Service) public services;
    // serviceId => seller
    mapping (uint256 => address) public sellers; 
    // orderId => Order
    mapping (uint256 => Order) public orders;
    // seller => orders Works well with few orders but
    // this must be offchain later on
    mapping (address => uint256[]) public sellerOrders;

    // buyer => orders Works well with few orders but
    // this must be offchain later on
    mapping (address => uint256[]) public buyerOrders;

    // Store deposits to an account for escrow
    mapping (address => uint256) public balanceLocked;

    // how much money is available to an address to withdraw
    // a user can have many orders going on but just a few finished
    mapping (address => uint256) public balanceAvailable;
    

    modifier verifyCaller (address _address) {require (msg.sender == _address, "No authorized"); _;}

    modifier paidEnough(uint256 _price) {require(msg.value >= _price, "Not sufficient funds"); _;}

    modifier checkValue(uint256 _orderId) {
        //refund them after pay for a order
        _;
        uint256 _price = orders[_orderId].price;
        uint256 amountToRefund = msg.value - _price;
        orders[_orderId].buyer.transfer(amountToRefund);
    }

    modifier isProposal(uint256 _orderId) {
        require(orders[_orderId].state == OrderState.Proposal, "This order is not in a proposal state");
        _;
    }

    modifier isAccepted(uint256 _orderId) {
        require(orders[_orderId].state == OrderState.Accepted, "This order is not in a accepted state");
        _;
    }

    modifier isFinished(uint256 _orderId) {
        require(orders[_orderId].state == OrderState.Finished, "This order is not in a finished state");
        _;
    }

    constructor() public {        
        serviceId = 0;
        orderId = 0;
    }
    
    /** @dev Create a new service
      * @param _minimumPrice Service starting price.
      * @param _data IPFS 32byte hash.
      */
    function createService(uint256 _minimumPrice, bytes32 _data) public {
        services[serviceId] = Service({id: serviceId, data: _data, minimumPrice: _minimumPrice, seller: msg.sender});
        sellers[serviceId] = msg.sender;
        serviceList.push(serviceId);
        emit ServiceCreated(serviceId);
        serviceId = serviceId.add(1);
    }
    
    /** @dev Create a new Order
      * @param _serviceId Service id number of the order.
      * @param _price Price of the order in wei.
      * @param _buyer Address of the buyer / payer of the order.
      */
    function createOrder(uint256 _serviceId, uint256 _price, address _buyer) public verifyCaller(services[_serviceId].seller) {
        Service memory _service = services[_serviceId];
        orders[orderId] = Order({
            id: orderId,
            serviceId: _serviceId,
            price: _price,
            seller: _service.seller,
            buyer: _buyer,
            state: OrderState.Proposal
        });    
        sellerOrders[services[_serviceId].seller].push(orderId);
        buyerOrders[_buyer].push(orderId);
        emit OrderProposal(orderId);
        orderId = orderId.add(1);
    }

    /** @dev A buyer accepts an order and pays the price that is store in the escrow
      * @param _orderId Order id number.      
      */
    function acceptOrder(uint256 _orderId)
        public
        payable 
        isProposal(_orderId)
        verifyCaller(orders[_orderId].buyer)
        checkValue(_orderId)
    {
        orders[_orderId].state = OrderState.Accepted;
        emit OrderAccepted(_orderId);
        // Lock balance to buyer account
        balanceLocked[orders[_orderId].buyer] = orders[_orderId].price;        
    }

    /** @dev A seller cancel a order and the funds go back to the buyer
      * @param _orderId Order id number.      
      */
    function cancelOrder(uint256 _orderId)
        public
        isAccepted(_orderId)
        verifyCaller(orders[_orderId].seller)        
    {
        uint256 payment = orders[_orderId].price;
        assert(balanceLocked[orders[_orderId].buyer] >= payment);
        
        balanceLocked[orders[_orderId].buyer] = balanceLocked[orders[_orderId].buyer].sub(payment);
        orders[_orderId].state = OrderState.Cancel;
        // Return funds to buyer
        emit OrderCancel(_orderId);
        orders[_orderId].buyer.transfer(payment);        
        
    }

    /** @dev A seller marks the job as finished
      * @param _orderId Order id number.      
      */
    function finishOrder(uint256 _orderId)
        public
        isAccepted(_orderId)
        verifyCaller(orders[_orderId].seller)
    {
        orders[_orderId].state = OrderState.Finished;
        emit OrderFinished(_orderId);
    }

    /** @dev A buyer accept the job and release the payment
      * @param _orderId Order id number.      
      */
    function releaseOrder(uint256 _orderId)
        public
        isFinished(_orderId)
        verifyCaller(orders[_orderId].buyer)
    {
        uint256 payment = orders[_orderId].price;
        assert(balanceLocked[orders[_orderId].buyer] >= payment);
        
        balanceLocked[orders[_orderId].buyer] = balanceLocked[orders[_orderId].buyer].sub(payment);
        orders[_orderId].state = OrderState.Approved;
        
        // Add funds to seller escrow
        balanceAvailable[orders[_orderId].seller] = balanceAvailable[orders[_orderId].seller].add(payment);
        
        emit OrderApproved(_orderId);
    }

    /**
    * @dev withdraw accumulated balance, called by payee.
    */
    function withdrawPayments() public {
        address payee = msg.sender;
        uint256 payment = balanceAvailable[payee];

        require(payment != 0, "Available balance should be positive");
        require(address(this).balance >= payment, "Should have enough balance");

        balanceAvailable[payee] = 0;

        payee.transfer(payment);

        emit Withdrawn(payee, payment);
    }

    /** @dev Get Service List
      * @return serviceList The service list
      */
    function getServices() public view returns(uint256[]) {
        return serviceList;
    }

    /** @dev Get all Orders from a seller
      * @return sellerOrders The seller orders list
      */
    function getOrdersFromSeller(address _seller) public returns(uint256[]){ 
        return sellerOrders[_seller]; 
    }

    /** @dev Get all Orders from a buyer
      * @return buyerOrders The buyer orders list
      */
    function getOrdersFromBuyer(address _buyer) public returns(uint256[]){ 
        return buyerOrders[_buyer]; 
    }

    /* for test proupurse only */
    function fetchService(uint256 _serviceId) public view returns (uint256 __serviceId, uint256 __price, bytes32 __data, address __seller) {
        __serviceId = services[_serviceId].id;
        __price = services[_serviceId].minimumPrice;
        __seller = services[_serviceId].seller;
        __data = services[_serviceId].data;
        return (__serviceId, __price, __data, __seller);
    }

    /* for test proupurse only */
    function fetchOrder(uint256 _orderId)
        public 
        view 
        returns (uint256 __orderId, uint256 __serviceId, uint256 __price, address __seller, address __buyer, uint __state) 
    {
        __orderId = orders[_orderId].id;
        __serviceId = orders[_orderId].serviceId;
        __price = orders[_orderId].price;
        __seller = orders[_orderId].seller;
        __buyer = orders[_orderId].buyer;
        __state = uint(orders[_orderId].state);
        return (__orderId, __serviceId, __price, __seller, __buyer, __state);
    }        
}