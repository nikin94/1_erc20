//SPDX-License-Identifier: Unlicense
//Author: Serhiy
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract MyERC20 is IERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public _totalSupply;
    address public owner;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    constructor() {
        name = "MyERC20";
        symbol = "MERC";
        _totalSupply = 1000000000000000000;
        decimals = 18;

        owner = msg.sender;

        balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    modifier ownerOnly() {
        require(msg.sender == owner, "Must be the owner");
        _;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply - balances[address(0)];
    }

    function balanceOf(address account) public view override returns (uint256) {
        return balances[account];
    }

    function allowance(address _owner, address _spender)
        public
        view
        override
        returns (uint256)
    {
        return allowed[_owner][_spender];
    }

    function approve(address spender, uint256 amount)
        public
        override
        returns (bool)
    {
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        require(balances[msg.sender] >= amount, "not enough tokens");

        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(balances[from] >= amount, "not enough tokens");
        require(allowed[from][to] >= amount, "not allowed to send this much");

        balances[from] -= amount;
        balances[to] += amount;
        allowed[from][to] -= amount;

        emit Transfer(from, to, amount);
        return true;
    }

    function mint(address account, uint256 value) public ownerOnly {
        _totalSupply += value;
        balances[account] += value;
        emit Transfer(address(0), account, value);
    }

    function burn(address account, uint256 value) public ownerOnly {
        require(balances[account] >= value, "not enough tokens on balance");
        _totalSupply -= value;
        balances[account] -= value;
        emit Transfer(account, address(0), value);
    }
}
