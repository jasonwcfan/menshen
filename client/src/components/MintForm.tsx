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
import MintFormClaimStep from './MintFormClaimStep'
import * as faceapi from 'face-api.js'


export default function MintForm() {
  

  const [step, setStep] = useState(1)
  const [faceDescriptor, setFaceDescriptor] = useState(new Float32Array)

  const location = useLocation()
  
  function incrementStep() {
    setStep(step + 1)
  }

  function resetStep() {
    setStep(1)
  }

  function handleGenerateCredential(faceDescriptor: Float32Array) {
    let newDesc = [0, 0, 0, 0]

    let p1 = faceDescriptor.slice(0, 32)
    let p2 = faceDescriptor.slice(32, 64)
    let p3 = faceDescriptor.slice(64, 96)
    let p4 = faceDescriptor.slice(96)

    newDesc[0] = Math.round(p1.reduce((p, c) => p+c)/32 * 100)
    newDesc[1] = Math.round(p2.reduce((p, c) => p+c)/32 * 100)
    newDesc[2] = Math.round(p3.reduce((p, c) => p+c)/32 * 100)
    newDesc[3] = Math.round(p4.reduce((p, c) => p+c)/32 * 100)

    console.log('biometric credential: ' + newDesc)

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
            <Text alignSelf="start" textAlign="left" fontSize="4xl" fontWeight="bold">Get your Menshen Credential</Text>
            <Text alignSelf="start" textAlign="left" fontSize="2xl">Menshen Credential is a zero-knowledge credential that proves that you are a human without storing any of your personal data.</Text>
            </VStack>
            <StepsComponent activeStep={step}/>
            <Container px={10} py={6} maxWidth="inherit" border="1px solid #E2E8F0">
            {(step === 1) && <MintFormVerifyStep incrementStep={incrementStep} faceDescriptor={faceDescriptor} setFaceDescriptor={setFaceDescriptor} generateCredential={handleGenerateCredential}/>}
                    {(step === 2) && <MintFormClaimStep faceDescriptor={faceDescriptor} />}

            </Container>
        </VStack>
    </Grid>
    </Box>
  )
}