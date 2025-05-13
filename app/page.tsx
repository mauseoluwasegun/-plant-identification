'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
// import Link from 'next/link'
import { identifyPlant } from '../utils/plantIdentifier'
import Footer from './components/footer'
import Card from './components/Card'
import Navbar from './components/Navbar'

export default function Home() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCard, setShowCard] = useState(true); 
  const [imageProcessing, setImageProcessing] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 4MB

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert('File is too large. Please choose an image smaller than 4MB.');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setShowCard(false);
      // setImageProcessing(true); // Start processing

      // Simulate processing delay and automatically submit after 2 seconds
      // setTimeout(() => {
      //   setImageProcessing(false);
      //   if (image && !loading) { // Check if image is present and not loading
      //     handleSubmit(); // Automatically submit the image after 2 seconds
      //   }
      // }, 5000); // 2 seconds duration
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access the camera. Please make sure you have granted the necessary permissions.');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg', lastModified: Date.now() });
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setShowCamera(false);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
  
    setLoading(true);
    setResult(null);
    setImageProcessing(true);
    setTimeout(() => {
      setImageProcessing(false);
      if (image && !loading) { // Check if image is present and // Automatically submit the image after 2 seconds
      }
    }, 9000);
     // Start time

  
    try {
   ; // Start time
      const response = await identifyPlant(image);
      const startTime = performance.now()
      const endTime = performance.now(); // End time
      const duration = endTime - startTime; // Duration in milliseconds
      console.log(`API call duration: ${duration.toFixed(2)} ms`);
      console.log('Raw response:', response);


      setLoading(true);
      setResult(null);
      setImageProcessing(true);
      setTimeout(() => {
        setImageProcessing(false);
        if (image && !loading) { // Check if image is present and // Automatically submit the image after 2 seconds
        }
      },duration);
  
      // Robust JSON parsing
      let parsedResult;
      if (typeof response === 'string') {
        const cleanResponse = response
          .replace(/^```json\s*/, '')  // Remove leading ```json
          .replace(/```$/, '')         // Remove trailing ```
          .trim();
  
        try {
          parsedResult = JSON.parse(cleanResponse);
          console.log("Parsed result", parsedResult);
        } catch (parseError) {
          console.error('Failed to parse JSON:', parseError);
          console.error('Raw response causing error:', cleanResponse);
          setResult({ error: 'Invalid response format. Please try again later.' });
          return;
        }
      } else if (typeof response === 'object') {
        parsedResult = response;
      } else {
        setResult({ error: 'Unexpected response type. Please try again later.' });
        return;
      }
  
      console.log('Processed result:', parsedResult);
      setResult(parsedResult);
    } catch (error) {
      console.error('Error identifying plant:', error);
      setResult({ error: 'Error identifying plant. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <div className="flex flex-grow">
          <main className="flex-grow bg-gradient-to-br from-green-100 to-green-300">
            <Navbar />
            <div className="flex justify-between max-md:flex-col items-center bg-green-400 p-10">
              <div>
                <h1 className="text-5xl font-bold text-green-50 capitalize leading-22 mb-3"> Discover your inner plant match

</h1>
                <p className="text-green-700 text-xl leading-7">
                  Discover the fascinating world of plants! <br /> Upload an image or take a photo, <br /> and let our AI identify the species for you.
                </p>
              </div>

              <div>
                <Image 
                  src="/images/crops.jpg" 
                  alt="" 
                  width={500} 
                  height={0} 
                  className='rounded-lg max-md:mt-5 max-md:w-96'
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>

            <div className="max-w-4xl mx-auto ">
              <div className="bg-white -mt-9 rounded-xl mb-6 shadow-lg p-6">
                <label htmlFor="image-upload" className="block text-lg font-medium text-gray-700 mb-2">
                  Upload a plant image
                </label>
                <div className="flex justify-between mb-6">
                  <div>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                  <div>
                    <button
                      onClick={startCamera}
                      className="w-36 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-300"
                    >
                      Take a Photo
                    </button>
                  </div>
                </div>
                {showCamera && (
                  <div className="mb-6">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" style={{ display: 'block', width: '100%', height: 'auto' }} />
                    <button
                      onClick={captureImage}
                      className="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
                    >
                      Capture Image
                    </button>
                  </div>
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
                {preview && (
                  <div className="mb-6 flex justify-center relative">
                    <div className="h-80 w-80 max-md:w-80 max-md:h-72 relative rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={preview}
                        alt="Preview"
                        layout="fill"
                        objectFit="cover"
                      />
                      {imageProcessing && (
                        <div className="absolute inset-0 flex justify-center items-center">
                          <div className="scanning-overlay flex justify-center items-center">{
                          loading ? <div className='border-9 border-indigo-200' style={{ width: '30px', height: '30px' }}>

                          </div>: 'Identify Plant'}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-center  content-center items-center">
                  <button
                    onClick={handleSubmit}
                    disabled={!image || loading}
                    className="w-60 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50 text-lg font-semibold mx-auto"
                  >
                    {loading ? 'Identifying...' : 'Identify Plant'}
                  </button>
                </div>
                {result && !result.error && (
                  <div className="mt-8 p-6 bg-green-50 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-green-800 mb-4">Plant Details:</h2>
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-green-700 mb-2">Description:</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{result.description}</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-green-200">
                            <th className="p-3 font-semibold">Property</th>
                            <th className="p-3 font-semibold">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-green-50">
                            <td className="p-3 font-medium">Scientific Name</td>
                            <td className="p-3"><i>{result.scientificName}</i></td>
                          </tr>
                          <tr className="bg-white">
                            <td className="p-3 font-medium">Family</td>
                            <td className="p-3">{result.family}</td>
                          </tr>
                          <tr className="bg-green-50">
                            <td className="p-3 font-medium">Native Region</td>
                            <td className="p-3">{result.nativeRegion}</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="p-3 font-medium">Genus</td>
                            <td className="p-3">{result.genus}</td>
                          </tr>
                          <tr className="bg-green-50">
                            <td className="p-3 font-medium">Plant Type</td>
                            <td className="p-3">{result.plantType}</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="p-3 font-medium">Growth Habit</td>
                            <td className="p-3">{result.growthHabit}</td>
                          </tr>
                          <tr className="bg-green-50">
                            <td className="p-3 font-medium">Leaf Description</td>
                            <td className="p-3">{result.leafDescription}</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="p-3 font-medium">Flower Characteristics</td>
                            <td className="p-3">{result.flowerCharacteristics}</td>
                          </tr>
                          <tr className="bg-green-50">
                            <td className="p-3 font-medium">Dimensions</td>
                            <td className="p-3">Height: {result.dimensions.height}, Spread: {result.dimensions.spread}</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="p-3 font-medium">Climate Zones</td>
                            <td className="p-3">{result.climateZones.join(', ')}</td>
                          </tr>
                          <tr className="bg-green-50">
                            <td className="p-3">{result.habitat}</td>
                            <td className="p-3 font-medium">Habitat</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {result && result.error && (
                  <div className="mt-6 p-4 bg-red-50 rounded-lg">
                    <p className="text-red-700">{result.error}</p>
                  </div>
                )}
              </div>
            </div>
            {showCard && <Card />}
          </main>
        </div>

        <Footer />
      </div>

      <style jsx>{`
        .scanning-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(0, 128, 128, 0.5), transparent);
          animation: scan 3s linear infinite;
        }

        @keyframes scan {
          0% {
            top: -100%;
          }
          50% {
            top: 0;
            background: linear-gradient(to bottom, transparent, rgba(0, 128, 128, 0.7), transparent);
          }
          100% {
            top: 100%;
            background: linear-gradient(to bottom, transparent, rgba(0, 128, 128, 0.9), transparent);
          }
        }
      `}</style>
    </>
  );
}