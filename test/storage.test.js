const Storage = artifacts.require("Storage");

require('chai').use(require('chai-as-promised')).should()

contract('Storage',(accounts) => {
    let contract
    before ( async() => {
        contract= await Storage.deployed()
    })
    describe('deployment', async() => {

        it('contract deployed successfully',async ()=>{
        const address = contract.address
        assert.notEqual(address,0x0)
        assert.notEqual(address,'')
        assert.notEqual(address,undefined)
        assert.notEqual(address,null)
        })

    })
    describe('storage', async() => {

        it('upload succesfull',async ()=>{
            let hash='test123'
            await contract.upload(hash)
            let result=await contract.download() ;
            assert.equal(result,'test123')

        })

    })
})
