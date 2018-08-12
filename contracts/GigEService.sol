pragma solidity ^0.4.24;


contract GigEService {
    address private owner;
    uint public idNumber = 0;
    uint public orderNumber = 0;
    uint[] public serviceList;
    
    struct Service {
        string title;
        string description;
        string image;
        string category;
        string subcategory;
        uint price;
        address seller;
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
    
    constructor() public {
        owner = msg.sender;    
    }
    
    function createService(string _title, string _description, string _image, string _category, string _subcategory, uint _price) public {
        services[idNumber] = Service({title: _title, description: _description, image: _image, category: _category, subcategory: _subcategory, price: _price, seller: msg.sender});
        sellers[idNumber] = msg.sender;
        serviceList.push(idNumber);
        idNumber = idNumber + 1;
    
    }
    
    function buyService(uint _serviceId) public payable {
        Service memory _service = services[_serviceId];
        require(msg.value >= _service.price);
        orders[orderNumber] = Order({id: orderNumber, serviceId: _serviceId, amount: _service.price, seller: _service.seller, buyer: msg.sender});
    }
    
}