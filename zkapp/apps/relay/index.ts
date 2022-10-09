import cors from "cors"
import { config as dotenvConfig } from "dotenv"
import { Contract, providers, utils, Wallet } from "ethers"
import express from "express"
import { resolve } from "path"
import { abi as greeterContractAbi } from "../contracts/build/contracts/contracts/Greeter.sol/Greeter.json"
import { abi as menshenContractAbi } from "../contracts/build/contracts/contracts/MenshenID.sol/MenshenID.json"
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"


dotenvConfig({ path: resolve(__dirname, "../../.env") })

if (typeof process.env.GREETER_CONTRACT_ADDRESS !== "string") {
    throw new Error("Please, define GREETER_CONTRACT_ADDRESS in your .env file")
}

if (typeof process.env.MENSHEN_CONTRACT_ADDRESS !== "string") {
    throw new Error("Please, define MENSHEN_CONTRACT_ADDRESS in your .env file")
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
const greeterContractAddress = process.env.GREETER_CONTRACT_ADDRESS
const menshenContractAddress = process.env.MENSHEN_CONTRACT_ADDRESS
const { port } = new URL(process.env.RELAY_URL)

const app = express()

app.use(cors())
app.use(express.json())

const provider = new providers.JsonRpcProvider(ethereumURL)
const signer = new Wallet(ethereumPrivateKey, provider)
const greeterContract = new Contract(greeterContractAddress, greeterContractAbi, signer)
const menshenContract = new Contract(menshenContractAddress, menshenContractAbi, signer)

function getCredential(faceDescriptor: Float32Array) {
    let cred = [0, 0, 0, 0]

    let p1 = faceDescriptor.slice(0, 32)
    let p2 = faceDescriptor.slice(32, 64)
    let p3 = faceDescriptor.slice(64, 96)
    let p4 = faceDescriptor.slice(96)

    cred[0] = Math.round(p1.reduce((p, c) => p+c)/32 * 100)
    cred[1] = Math.round(p2.reduce((p, c) => p+c)/32 * 100)
    cred[2] = Math.round(p3.reduce((p, c) => p+c)/32 * 100)
    cred[3] = Math.round(p4.reduce((p, c) => p+c)/32 * 100)

    return cred

  }

app.post("/greet", async (req, res) => {
    const credential = req.body.credentials
    console.log('credential: ')
    console.log(credential)

    try {

        const identity = new Identity(credential)
        const groupId = await greeterContract.groupId()
        const users = await greeterContract.queryFilter(greeterContract.filters.NewUser())
        const group = new Group()
        const greeting = 'mint'

        group.addMembers(users.map((e) => e.args![0].toString()))

        const { proof, publicSignals } = await generateProof(identity, group, groupId.toString(), greeting)
        const solidityProof = packToSolidityProof(proof)

        // Instead of this we will call a mint function of an NFT smart contract from the client side.
        // The NFT contract which will then call Greeter contract to verify the proof.
        const transaction = await menshenContract.mintNFT(
            utils.formatBytes32String(greeting),
            publicSignals.merkleRoot,
            publicSignals.nullifierHash,
            solidityProof
        )

        await transaction.wait()

        res.send(transaction.hash).status(200).end()
    } catch (error: any) {
        console.error(error)
        res.status(500).end()
    }
})

app.post("/join-group", async (req, res) => {
    const { faceDescriptor } = req.body

    const credential = 'abcd' + getCredential(faceDescriptor)
    console.log('credential: ')
    console.log(credential)

    const identity = new Identity(credential)

    const commitment = identity.generateCommitment().toString()

    const trapdoor = identity.getTrapdoor().toString()
    const nullifier = identity.getNullifier().toString()

    const result = {
        trapdoor: trapdoor,
        nullifier: nullifier
    }

    try {
        const transaction = await greeterContract.joinGroup(commitment, utils.formatBytes32String('username'))

        await transaction.wait()

        res.status(200).send(identity.toString())
    } catch (error: any) {
        console.error(error)

        res.status(500).end()
    }
})

app.listen(port, () => {
    console.info(`Started HTTP relay API at ${process.env.RELAY_URL}/`)
})