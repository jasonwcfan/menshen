import React, { useEffect, useState} from 'react'
import {
  useDisclosure,
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
  theme,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react'
import * as faceapi from 'face-api.js'

import VerifyModal from './VerifyModal';

export default function MintFormVerifyStep({incrementStep}: {incrementStep: any}) {

    const [verifyStep, setVerifyStep] = useState(0)
    const [uploaded, setUploaded] = useState(false)
    const [descriptor1, setDescriptor1] = useState(new Float32Array)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const disclosureText = "Menshen processes all data on-device, and does not send your data to a centralized server or any third parties."

    function renderStep() {
      return <Box>
        <Button onClick={onOpen}>Verify</Button>
        <Text mt={4} textAlign="left" fontSize="sm" textColor={"grey"}><b>Your privacy is preserved. </b>{disclosureText}</Text>
      </Box>
    }

    function handleSubmitFaceDescriptor(faceDescriptor: Float32Array) {
      // Sandbox
      console.log(faceDescriptor)
      if (descriptor1.length < 1) {
        setDescriptor1(faceDescriptor)
      } else {
        // compare descriptors
        console.log(faceapi.euclideanDistance(descriptor1, faceDescriptor))

        // compare transformed descriptors
        // let tDesc1 = descriptor1.reduce((p, c, i) => {
        //   return Math.ceil(p * c)
        // })

        // let tDesc2 = faceDescriptor.map((p) => {
        //   return Math.ceil(p * 10)
        // })

        // console.log(faceapi.euclideanDistance(tDesc1, tDesc2))

      }
    }

    return(
        <>
        <Text fontSize="3xl" fontWeight="bold" textAlign="left">Verify your personhood</Text>
        <Text textAlign="left">Scan your face to prove you're human and that you haven't already minted a Menshen Passport before.</Text>
        <Container>
          {renderStep()}
        </Container>
        <Modal isOpen={isOpen} onClose={onClose} size='full'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VerifyModal onSubmitFaceDescriptor={handleSubmitFaceDescriptor}/>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='teal' mr={3}>
                Submit
              </Button>
              <Button variant='ghost' onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        </>
    )

}