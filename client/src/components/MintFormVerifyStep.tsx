import React, { useEffect, useState} from 'react'
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
  GridItem,
  theme
} from '@chakra-ui/react'

export default function MintFormVerifyStep({incrementStep}: {incrementStep: any}) {

    const [verifyStep, setVerifyStep] = useState(0)
    const [uploaded, setUploaded] = useState(false)

    function renderStep() {
         return <Container>
          <Text py={6}>testing</Text>
          <Button onClick={handleDeny}>Back</Button>
        </Container>
    }

    function handleDeny() {
      setVerifyStep(verifyStep < 3 ? verifyStep + 1 : 0)
    }

    return(
        <>
        <Text fontSize="3xl" fontWeight="bold" textAlign="left">Verify your personhood</Text>
        <Text textAlign="left">Scan your face to prove you're human. You will receive the same credential every time you go through this process.</Text>
        <Container>
          {renderStep()}
        </Container>
        </>
    )

}