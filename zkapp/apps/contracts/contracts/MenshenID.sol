//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MenshenID is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    ISemaphore public semaphore;
    uint256 public groupId;

    constructor(address semaphoreAddress, uint256 _groupId) ERC721("Menshen Sybil Proof ID", "MEID") public {
        semaphore = ISemaphore(semaphoreAddress);
        groupId = _groupId;
    }

    function mintNFT(
        bytes32 greeting,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public returns (uint256) {

        semaphore.verifyProof(groupId, merkleTreeRoot, greeting, nullifierHash, groupId, proof);


        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        return newItemId;
    }
}