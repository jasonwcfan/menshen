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
import VerifyStep from './VerifyStep'
import ClaimStep from './ClaimStep'
import * as faceapi from 'face-api.js'


export default function AppContainer() {
  

  const [step, setStep] = useState(1)
  const [faceDescriptor, setFaceDescriptor] = useState(new Float32Array)
  
  function incrementStep() {
    setStep(step + 1)
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
              {(step === 1) && <VerifyStep incrementStep={incrementStep} faceDescriptor={faceDescriptor} setFaceDescriptor={setFaceDescriptor}/>}
              {(step === 2) && <ClaimStep faceDescriptor={faceDescriptor} />}
            </Container>
        </VStack>
    </Grid>
    </Box>
  )
}