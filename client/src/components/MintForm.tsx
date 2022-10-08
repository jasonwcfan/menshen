import React, {useEffect, useState} from 'react'
import {
  ChakraProvider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  Container,
  Heading,
  Box,
  Button,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import {useLocation} from 'react-router-dom'
import StepsComponent from './StepsComponent'
import MintFormVerifyStep from './MintFormVerifyStep'


export default function MintForm() {
  

  const [step, setStep] = useState(1)
  const [documents, setDocuments] = useState([])
  const [managerAddress, setManagerAddress] = useState("")

  const location = useLocation()
  
  function incrementStep() {
    setStep(step + 1)
  }

  function resetStep() {
    setStep(1)
  }



  return (

    <Box textAlign="center" fontSize="xl">
    <Grid minH="100vh" p={3}>
        
        {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
        <VStack spacing={9} minWidth="300px" width="75vw" justifySelf="center">
            <VStack spacing={1} width="100%">
              <Spacer />
              <Spacer />
              <Spacer />
            <Text alignSelf="start" textAlign="left" fontSize="4xl" fontWeight="bold">Mint a Menshen Passport</Text>
            <Text alignSelf="start" textAlign="left" fontSize="2xl">Triton Passport is an NFT that proves that you are a human without sharing any of your personal data.</Text>
            </VStack>
            <StepsComponent activeStep={step}/>
            <Container px={10} py={6} maxWidth="inherit" border="1px solid #E2E8F0">
                    {(step === 1) && <MintFormVerifyStep incrementStep={incrementStep} />}
                    {/* {(step === 2) && <MintFormContactStep resetStep={resetStep} />} */}

            </Container>
        </VStack>
    </Grid>
    </Box>
  )
}