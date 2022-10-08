import React, {useEffect, useState} from 'react'
import {
  Modal,
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


export default function VerifyModal() {
  

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
        soidjfoisdjfodsjfoisdj
    </Box>
  )
}