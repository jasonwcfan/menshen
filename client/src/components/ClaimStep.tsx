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


export default function ClaimStep({faceDescriptor}: {faceDescriptor: Float32Array}) {
    const [credential, setCredential] = useState<String | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    function getFaceDescriptorNumbers(faceDescriptor: any) {
        var result = []

        for (const item of faceDescriptor) {
            result.push(Number(item))
        }

        return result
    }

    async function generateCredential() {

        setIsLoading(true)
        setCredential(null)

        const faceDescriptorNumbers = getFaceDescriptorNumbers(faceDescriptor)

        const body = JSON.stringify({
            faceDescriptor: faceDescriptorNumbers
        })

        try {
            const result = await fetch(`http://localhost:4000/join-group`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: body
            })

            const resultJson = await result.json()

            setCredential(JSON.stringify(resultJson))
            setIsLoading(false)
        } catch(e) {
            console.log(e)
            setIsLoading(false)
        }    
   }

    return(
        <>
        <Text fontSize="3xl" fontWeight="bold" textAlign="left">Claim Credential</Text>
        <Text textAlign="left">You have successfully proved your humanity. Claim your credential below.</Text>
        <Container>
        <Box>
            <Button colorScheme='teal' isLoading={isLoading} onClick={generateCredential}>Claim credential</Button>
            {credential !== null && 
                <Text mt={4} textAlign="left">Your credential: {credential.toString()}</Text>
            }
            
        </Box>
        </Container>
        </>
    )
}