pragma solidity ^0.4.24;

import "zeppelin/contracts/lifecycle/Destructible.sol";
import "zeppelin/contracts/lifecycle/Pausable.sol";
import "zeppelin/contracts/math/SafeMath.sol";

contract GigEService is Destructible, Pausable {
    using SafeMath for uint256;

    uint256 public serviceId;
    uint256 public orderId;
    uint256[] public serviceList;

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

    constructor() public {        
        serviceId = 0;
        orderId = 0;
    }
    
    /**
    * createService
    * Create a new Service for the Store
    */
    function createService(uint256 _minimumPrice, bytes32 _data) public {
        services[serviceId] = Service({id: serviceId, data: _data, minimumPrice: _minimumPrice, seller: msg.sender});
        sellers[serviceId] = msg.sender;
        serviceList.push(serviceId);
        emit ServiceCreated(serviceId);
        serviceId = serviceId.add(1);
    }
    
    /**
    * createOrder
    * The seller create a new Order proposal
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
        emit OrderProposal(orderId);
        orderId = orderId.add(1);        
    }

    /**
    * acceptOrder
    * The buyer accept the Order proposal
    */
    function acceptOrder(uint256 _orderId)
        public
        payable 
        isProposal(_orderId)
        verifyCaller(orders[_orderId].buyer)
        checkValue(_orderId)
    {
        orders[_orderId].seller.transfer(orders[_orderId].price);
        orders[_orderId].state = OrderState.Accepted;
        emit OrderAccepted(_orderId);        
    }

    function getServices() public view returns(uint256[]) {
        return serviceList;
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