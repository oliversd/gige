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


    constructor() public {        
        serviceId = 0;
        orderId = 0;
    }
    
    function createService(uint256 _minimumPrice, bytes32 _data) public {
        services[serviceId] = Service({id: serviceId, data: _data, minimumPrice: _minimumPrice, seller: msg.sender});
        sellers[serviceId] = msg.sender;
        serviceList.push(serviceId);
        emit ServiceCreated(serviceId);
        serviceId = serviceId.add(1);
    }
    
    function createOrder(uint256 _serviceId, uint256 _price, address _buyer) public {
        Service memory _service = services[_serviceId];
        orders[orderId] = Order({
            id: orderId,
            serviceId: _serviceId,
            price: _price,
            seller: _service.seller,
            buyer: _buyer,
            state: OrderState.Proposal
        });
        orderId = orderId.add(1);
    }

    function getServices() public view returns(uint256[]) {
        return serviceList;
    }
    
}