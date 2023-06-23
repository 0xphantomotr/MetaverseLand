// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/ERC4907.sol";

contract ERC4907Test is Test {
    
    ERC4907 public erc4907;

    function setUp() public {
        erc4907 = new ERC4907("Land", "LND");
    }

    function testSafeMint() public {
        erc4907.safeMint(msg.sender, 2);
        uint256 tokenBalance = erc4907.balanceOf(msg.sender);
        assertEq(tokenBalance, 1, "Owner should have 1 token!");
    }

    function testSetUser() public {
        erc4907.safeMint(address(1), 7);
        erc4907.setUser(7, address(1), 1685656678);
        assertEq(erc4907.userOf(7), address(1), "User didn't get set right");
    }

    function testUserExpires() public {
        erc4907.safeMint(msg.sender, 1);
        erc4907.setUser(1, msg.sender, 1685656678);
        uint256 expirationDate = erc4907.userExpires(1);
        assertEq(expirationDate, 1685656678, "Expiration date not correct");
    }

    function testTotalSupply() public {
        erc4907.safeMint(msg.sender, 1);
        erc4907.safeMint(msg.sender, 4);
        erc4907.safeMint(msg.sender, 2);
        uint256 totalSupply = erc4907.totalSupply();
        console.log(totalSupply);
        assertEq(totalSupply, 3, "total supply is not accurate!");
    }
}