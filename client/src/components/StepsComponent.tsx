import React, { useEffect, useState} from 'react'
import {
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
  theme,
} from '@chakra-ui/react'


export default function StepsComponent({activeStep}: {activeStep: any}) {


    const steps = [
        { label: "STEP 1", description: "Verify your identity" },
        { label: "STEP 2", description: "Mint your passport NFT" }
    ]


    return(
        <Grid templateColumns='repeat(2, 1fr)' gap={6} width="100%">
            {steps.map(({ label, description }, index) => (
                <GridItem w='100%' h='10' fontSize="14px" key={index}>
                    <Box w='100%' h='1' bg={activeStep > index ? '#319795' : '#E2E8F0'}/>
                    <VStack spacing={0} alignItems="flex-start">
                        <Text pt={2} color={activeStep > index ? '#319795' : '#718096'}>{label}</Text>
                        <Text>{description}</Text>
                    </VStack>
                </GridItem>
            ))}
        </Grid> 
    )
    
}