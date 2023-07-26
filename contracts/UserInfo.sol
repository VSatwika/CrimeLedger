// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserInfo {
    struct User {
        string caseNumber;
        string crime;
        string suspect;
        string victim;
        string witness;
        string dateofcrime;
        string location;
        string officer;
        string description;
        string status;
        string ipfsHash;
    }
    User[] public users;
    mapping(string => uint[]) private crimeToIndexes;

    function addUser(string memory _caseNumber,string memory _crime, string memory _suspect, string memory _victim, string memory _witness,string memory _dateofcrime,string memory _location, string memory _officer, string memory _description, string memory _status, string memory _ipfsHash) public {
        User memory user = User(_caseNumber,_crime, _suspect, _victim, _witness, _dateofcrime,_location, _officer, _description, _status, _ipfsHash);
        users.push(user);
        crimeToIndexes[_crime].push(users.length - 1);
    }

function searchRecordByCrime(string memory _crime) public view returns (User[] memory) {
        uint256[] memory indexes = crimeToIndexes[_crime];

        User[] memory matchingRecords = new User[](indexes.length);
        for (uint256 i = 0; i < indexes.length; i++) {
            matchingRecords[i] = users[indexes[i]];
        }
        return matchingRecords;
    }
}