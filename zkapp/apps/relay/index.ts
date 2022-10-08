import cors from "cors"
import { config as dotenvConfig } from "dotenv"
import { Contract, providers, utils, Wallet } from "ethers"
import express from "express"
import { resolve } from "path"
import { abi as contractAbi } from "../contracts/build/contracts/contracts/Greeter.sol/Greeter.json"
import { Identity } from "@semaphore-protocol/identity"


dotenvConfig({ path: resolve(__dirname, "../../.env") })

if (typeof process.env.CONTRACT_ADDRESS !== "string") {
    throw new Error("Please, define CONTRACT_ADDRESS in your .env file")
}

if (typeof process.env.ETHEREUM_URL !== "string") {
    throw new Error("Please, define ETHEREUM_URL in your .env file")
}

if (typeof process.env.ETHEREUM_PRIVATE_KEY !== "string") {
    throw new Error("Please, define ETHEREUM_PRIVATE_KEY in your .env file")
}

if (typeof process.env.RELAY_URL !== "string") {
    throw new Error("Please, define RELAY_URL in your .env file")
}

const ethereumPrivateKey = process.env.ETHEREUM_PRIVATE_KEY
const ethereumURL = process.env.ETHEREUM_URL
const contractAddress = process.env.CONTRACT_ADDRESS
const { port } = new URL(process.env.RELAY_URL)

const app = express()

app.use(cors())
app.use(express.json())

const provider = new providers.JsonRpcProvider(ethereumURL)
const signer = new Wallet(ethereumPrivateKey, provider)
const contract = new Contract(contractAddress, contractAbi, signer)

app.post("/greet", async (req, res) => {
    const { greeting, merkleRoot, nullifierHash, solidityProof } = req.body

    try {

        // Instead of this we will call a mint function of an NFT smart contract from the client side.
        // The NFT contract which will then call Greeter contract to verify the proof.
        const transaction = await contract.greet(
            utils.formatBytes32String(greeting),
            merkleRoot,
            nullifierHash,
            solidityProof
        )

        await transaction.wait()

        res.status(200).end()
    } catch (error: any) {
        console.error(error)

        console.log('error')

        res.status(500).end()
    }
})

app.post("/join-group", async (req, res) => {
    const { identityCommitment, username } = req.body

    const facePoints = '[1, 2, 3, 4]'

    const identity = new Identity(facePoints)

    const commitment = identity.generateCommitment().toString()

    const trapdoor = identity.getTrapdoor().toString()
    const nullifier = identity.getNullifier().toString()

    const result = {
        trapdoor: trapdoor,
        nullifier: nullifier
    }




    try {
        const transaction = await contract.joinGroup(commitment, utils.formatBytes32String('username'))

        await transaction.wait()

        res.status(200).json(result)
    } catch (error: any) {
        console.error(error)

        res.status(500).end()
    }
})

app.listen(port, () => {
    console.info(`Started HTTP relay API at ${process.env.RELAY_URL}/`)
})