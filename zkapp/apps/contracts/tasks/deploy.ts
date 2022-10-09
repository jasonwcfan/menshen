import { task, types } from "hardhat/config"

task("deploy", "Deploy a MenshenZK contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addParam("group", "Group identifier", 42, types.int)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress, group: groupId }, { ethers, run }) => {
        if (!semaphoreAddress) {
            const { address: verifierAddress } = await run("deploy:verifier", { logs, merkleTreeDepth: 20 })

            const { address } = await run("deploy:semaphore", {
                logs,
                verifiers: [
                    {
                        merkleTreeDepth: 20,
                        contractAddress: verifierAddress
                    }
                ]
            })

            semaphoreAddress = address
        }
        
        // Note that the signer deploying this contract is going to be the first address:
        // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

        const menshenZK = await ethers.getContractFactory("MenshenZK")

        const menshenID = await ethers.getContractFactory("MenshenID")

        const menshenZKInstance = await menshenZK.deploy(semaphoreAddress, groupId)

        const menshenIDInstance = await menshenID.deploy(semaphoreAddress, groupId)

        await menshenZKInstance.deployed()

        await menshenIDInstance.deployed()

        if (logs) {
            console.info(`MenshenZK contract has been deployed to: ${menshenZKInstance.address}`)
            console.info(`MenshenID contract has been deployed to: ${menshenIDInstance.address}`)
        }

        return menshenZKInstance
    })