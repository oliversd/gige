pragma solidity ^0.4.24;

import 'zeppelin/contracts/lifecycle/Destructible.sol';
import 'zeppelin/contracts/lifecycle/Pausable.sol';

contract GigEService is Destructible, Pausable {
    address private owner;
    uint public idNumber = 0;
    uint public orderNumber = 0;
    uint[] public serviceList;

    event Created(uint id);
    
    struct Service {
        uint id;
        uint price;
        address seller;
        bytes32 data;
    }
    
    struct Order {
        uint id;
        uint serviceId;
        uint amount;
        address seller;
        address buyer;
    }
    
    // serviceId => Service
    mapping (uint => Service) public services;
    // serviceId => seller
    mapping (uint => address) public sellers; 
    // orderId => Order
    mapping (uint => Order) public orders;
    
    function createService(uint _price, bytes32 _data) public {
        services[idNumber] = Service({id: idNumber, data: _data, price: _price, seller: msg.sender});
        sellers[idNumber] = msg.sender;
        serviceList.push(idNumber);
        emit Created(idNumber);
        idNumber = idNumber + 1;
    }
    
    function buyService(uint _serviceId) public payable {
        Service memory _service = services[_serviceId];
        require(msg.value >= _service.price);
        orders[orderNumber] = Order({id: orderNumber, serviceId: _serviceId, amount: _service.price, seller: _service.seller, buyer: msg.sender});
    }

    function getServices() public view returns(uint[]) {
        return serviceList;
    }
    
}