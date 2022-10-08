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


export default function MintFormClaimStep({faceDescriptor}: {faceDescriptor: Float32Array}) {

    const [credential, setCredential] = useState<number[]>([])


    function handleGenerateCredential() {
        let cred = [0, 0, 0, 0]
    
        let p1 = faceDescriptor.slice(0, 32)
        let p2 = faceDescriptor.slice(32, 64)
        let p3 = faceDescriptor.slice(64, 96)
        let p4 = faceDescriptor.slice(96)
    
        cred[0] = Math.round(p1.reduce((p, c) => p+c)/32 * 100)
        cred[1] = Math.round(p2.reduce((p, c) => p+c)/32 * 100)
        cred[2] = Math.round(p3.reduce((p, c) => p+c)/32 * 100)
        cred[3] = Math.round(p4.reduce((p, c) => p+c)/32 * 100)
    
        setCredential(cred)
    
      }

    return(
        <>
        <Text fontSize="3xl" fontWeight="bold" textAlign="left">Claim Credential</Text>
        <Text textAlign="left">You have successfuly proved your humanity. Claim your credential below.</Text>
        <Container>
        <Box>
            <Button colorScheme='teal' onClick={handleGenerateCredential}>Claim credential</Button>
            {credential.length > 0 && 
                <Text mt={4} textAlign="left">Your credential: {credential.toString()}</Text>
            }
            
        </Box>
        </Container>
        </>
    )
}