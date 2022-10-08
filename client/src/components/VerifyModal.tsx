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
import * as faceapi from 'face-api.js'


export default function VerifyModal({onSubmitFaceDescriptor} : {onSubmitFaceDescriptor: Function}) {

  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [captureVideo, setCaptureVideo] = useState(false)
  const [faceDescriptor, setFaceDescriptor] = useState(new Float32Array)
  const [landmarks, setLandmarks] = useState(new Array<faceapi.Point>)

  const videoRef = React.useRef<HTMLVideoElement>(null)
  const videoHeight = 480
  const videoWidth = 640
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const screenshotRef = React.useRef<HTMLImageElement>(null)

  const [step, setStep] = useState(1)
  const [documents, setDocuments] = useState([])
  const [managerAddress, setManagerAddress] = useState("")

  const location = useLocation()
  
  React.useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      // await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)

      setModelsLoaded(true)
    }
    loadModels();
  }, []);

  const startVideo = async () => {
    setCaptureVideo(true);
    if (screenshotRef.current) {
      screenshotRef.current.src = ''
    }
    try {
      let stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 300 } })
      let video: HTMLVideoElement | null = videoRef.current
      if (video) {
        video.srcObject = stream
        video.play()
      } else {
        throw('video does not exist')
      }
    } catch(err) {
      console.log(err)
    }
  }

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current && videoRef.current) {
        canvasRef.current.append(faceapi.createCanvasFromMedia(videoRef.current))
        const displaySize = {
          width: videoWidth,
          height: videoHeight
        }

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()

        if (detections) {
          const resizedDetections = faceapi.resizeResults(detections, displaySize)
          canvasRef && canvasRef.current && canvasRef.current.getContext('2d')?.clearRect(0, 0, videoWidth, videoHeight)
          canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections as faceapi.draw.DrawFaceLandmarksInput)
          setFaceDescriptor(detections.descriptor)
        }
      }
    }, 100)
  }
    
    const closeWebcam = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        if (canvasRef.current && screenshotRef.current) {
          // canvasRef.current?.getContext('2d')?.drawImage(videoRef.current, 0, 0);
          screenshotRef.current.src = canvasRef.current?.toDataURL('image/jpeg')
          // screenshotRef.current.append(img)
          onSubmitFaceDescriptor(faceDescriptor)
        }
        let mediaStream: MediaStream = videoRef.current.srcObject as MediaStream
        mediaStream.getTracks()[0].stop();
      }
      setCaptureVideo(false);
    }



  return (

    <Box textAlign="center" fontSize="xl">
      <Box textAlign='center' p={10}>
        {
          captureVideo && modelsLoaded ?
            <Button onClick={closeWebcam} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Close Webcam
            </Button>
            :
            <button onClick={startVideo} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Open Webcam
            </button>
        }
      </Box>
      <Box display='flex' justifyContent='center'>
          <Box position='relative' width={videoWidth} height={videoHeight}>
            {captureVideo && modelsLoaded && <>
              <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
              <canvas ref={canvasRef} style={{ position: 'absolute' , top: 0, left: 0}} />
            </>}
            <img ref={screenshotRef} style={{ position: 'absolute' , top: 0, left: 0, zIndex: 9999}}/>
          </Box>
        </Box>
    </Box>
  )
}