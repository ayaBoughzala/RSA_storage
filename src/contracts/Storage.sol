pragma solidity >=0.4.21 <0.6.0;


contract Storage {

	string fileHash ;
//upload (not free)
    function upload(string memory _fileHash) public
    {fileHash=_fileHash;}
//download(free)
    function download() public view returns ( string memory){
    return fileHash ;
    }
}