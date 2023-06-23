// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/ERC4907.sol";

contract Erc4907Script is Script {

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ERC4907 rentableLand = new ERC4907("Land", "LND");

        vm.stopBroadcast();
    }
}