pragma solidity ^0.4.24;

contract lister {
    mapping(int => string) list;
    int id = 0;
    address owner;

    function getList(int index) public view returns (string memory) {
        return list[index];
    }
    
    function getCount() public view returns(int) {
        return id;
    }

    function setItemToList(string memory str) public {
        list[id] = str;
        id++;
    }
}
