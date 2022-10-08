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

import VerifyModal from './VerifyModal';

export default function MintFormVerifyStep({incrementStep}: {incrementStep: any}) {

    const [verifyStep, setVerifyStep] = useState(0)
    const [uploaded, setUploaded] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const disclosureText = "Menshen processes all data on-device, and does not send your data to a centralized server or any third parties."

    function renderStep() {
      return <Box>
        <Button onClick={onOpen}>Verify</Button>
        <Text mt={4} textAlign="left" fontSize="sm" textColor={"grey"}><b>Your privacy is preserved. </b>{disclosureText}</Text>
      </Box>
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
              <VerifyModal/>
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