import {useEffect, useState} from 'react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Button,
  Input,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Flex,
  Spacer,
  useDisclosure
} from '@chakra-ui/react'
import {ethers, utils} from 'ethers'
import MenshenID from '../utils/MenshenID.json'
import { getPreEmitDiagnostics } from 'typescript'

const MENSHENID_CONTRACT_ADDRESS_HARDHAT = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
// const CONTRACT_ADDRESS_RINKEBY = ""

export default function MintPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState("")
  const [errorReason, setErrorReason] = useState("")
  const [nftHash, setNftHash] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()


  useEffect(() => {
    async function promptLogin() {
      try {
        const { ethereum } = window;
        await ethereum.request({ method: 'eth_requestAccounts' });
      } catch {
        console.log("No wallet detected")
      }
    }

    promptLogin()
      
  })

  const clickMint = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(MENSHENID_CONTRACT_ADDRESS_HARDHAT, MenshenID.abi, signer);

        setIsLoading(true)

        const response = await fetch(`http://localhost:4000/greet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                credentials
            })
        })

        if (response.status === 200) {
          console.log(`You were verified 🎉`)
          console.log(response.body)
          const { greeting, merkleRoot, nullifierHash, solidityProof } = await response.json()

          const transaction = await connectedContract.mintNFT(
            utils.formatBytes32String(greeting),
            merkleRoot,
            nullifierHash,
            solidityProof
          )
          await transaction.wait();
          setIsLoading(false)
          setNftHash(transaction.hash)
          onOpen()
        } else {
          console.error('You do not have permission to mint')
        }

        setIsLoading(false)

      } else  {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error: any) {
      console.log(error.reason)
      setErrorReason(error.reason)
      setIsLoading(false)
    }
  }

  return (
    <Box textAlign="center" fontSize="xl">
    <Grid minH="100vh" p={3}>
      <VStack spacing={9} minWidth="300px" width="75vw" justifySelf="center">
        {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
        <VStack spacing={1} width="100%">
          <Spacer />
          <Spacer />
          <Spacer />
          <Text alignSelf="start" textAlign="left" fontSize="4xl" fontWeight="bold">Mint your Menshen ID (MEID)</Text>
          <Text alignSelf="start" textAlign="left" fontSize="2xl">Menshen ID is a verifiable credential that proves that you are a human without sharing any of your personal data.</Text>
          <Spacer />
          <Spacer />
          <Spacer />
          <Input placeholder="Paste your credentials here" value={credentials} onChange={(e) => setCredentials(e.target.value)}/>
          <Button m={6} colorScheme="teal" onClick={clickMint} isLoading={isLoading} width="50%">Mint MEID</Button>
          <Spacer />
          <Spacer />
          <Spacer />
          {errorReason && <Alert status="error" textAlign="left">
            <AlertIcon />
            <Box width="100%">
              <AlertTitle>Minting failed</AlertTitle>
              <AlertDescription>{errorReason}</AlertDescription>
            </Box>
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={() => setErrorReason("")}
            />   
          </Alert>}
        </VStack>
      </VStack>
    </Grid>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>Congratulations</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {`You have successfuly minted a Menshen ID. See transaction: https://rinkeby.etherscan.io/tx/${nftHash}`}
      </ModalBody>
      <ModalFooter>
        <Button 
          colorScheme='teal' 
          mr={3} 
          onClick={onClose}
        >
        Close
        </Button>
      </ModalFooter>
      </ModalContent>
    </Modal>
    </Box>
  )
}