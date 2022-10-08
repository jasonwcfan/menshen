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


export default function MintFormClaimStep({faceDescriptor}: {faceDescriptor: any}) {

    const [credential, setCredential] = useState(null)


    function generateCredential() {
        console.log(faceDescriptor)
        setCredential(faceDescriptor.length) 
   }

    return(
        <>
        <Text fontSize="3xl" fontWeight="bold" textAlign="left">Claim Credential</Text>
        <Text textAlign="left">You have successfuly proved your humanity. Claim your credential below.</Text>
        <Container>
        <Box>
            <Button colorScheme='teal' onClick={generateCredential}>Claim credential</Button>
            {credential !== null && 
                <Text mt={4} textAlign="left">Your credential: {credential}</Text>
            }
            
        </Box>
        </Container>
        </>
    )
}