import React, { useState } from 'react';
import { Button, Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Custom CSS file for additional styling

function App() {
  const [imageText, setImageText] = useState('');
  const [audioText, setAudioText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/image-to-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setImageText(data.text);
      setError(''); // Reset error
    } catch (error) {
      console.error('Error:', error);
      setError('Error occurred while processing the image.');
      setImageText('');
    } finally {
      setLoading(false);
    }
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('audio', file);

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/audio-to-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setAudioText(data.text);
      setError(''); // Reset error
    } catch (error) {
      console.error('Error:', error);
      setError('Error occurred while processing the audio.');
      setAudioText('');
    } finally {
      setLoading(false);
    }
  };

  const handleTextToAudio = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/text-to-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: imageText || audioText }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio');
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setAudioUrl(audioUrl); // Set the audio URL to be used for playback
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to convert text to audio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      {/* Main Heading */}
      <h1 className="text-center mb-4">AuraText</h1>

      {/* Subheading */}
      <h3 className="text-center mb-4 text-muted">
        Instantly turn your images and audio into text, then bring that text to life with speech, making information more accessible and easier to engage with.
      </h3>

      {/* Error Alert */}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        {/* Image Upload Section */}
        <Col md={6}>
          <Card className="card shadow-sm p-3 mb-5 rounded">
            <Card.Body>
              <h3>Upload an Image</h3>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control mb-3" />
              {imageText && <p className="text-info">{imageText}</p>}
            </Card.Body>
          </Card>
        </Col>

        {/* Audio Upload Section */}
        <Col md={6}>
          <Card className="card shadow-sm p-3 mb-5 rounded">
            <Card.Body>
              <h3>Upload an Audio File</h3>
              <input type="file" accept="audio/*" onChange={handleAudioUpload} className="form-control mb-3" />
              {audioText && <p className="text-info">{audioText}</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Convert Text to Audio Section */}
      {(imageText || audioText) && (
        <div className="text-center">
          <Button onClick={handleTextToAudio} disabled={loading} className="btn btn-primary btn-lg">
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Convert Text to Audio'
            )}
          </Button>
        </div>
      )}

      {/* Audio Playback Section */}
      {audioUrl && (
        <div className="mt-4 text-center">
          <audio controls src={audioUrl} className="shadow-lg"></audio>
        </div>
      )}

      {/* Loading State */}
      {loading && <p className="text-center mt-4 loading">Processing, please wait...</p>}
    </Container>
  );
}

export default App;











// import React, { useState } from 'react';
// import { Button, Container, Row, Col, Card, Spinner } from 'react-bootstrap';

// function App() {
//   const [imageText, setImageText] = useState('');
//   const [audioText, setAudioText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [audioUrl, setAudioUrl] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append('image', file);

//     setLoading(true);
//     setErrorMessage('');
//     try {
//       const response = await fetch('http://127.0.0.1:5000/api/image-to-text', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       setImageText(data.text);
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('Error occurred while processing the image.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAudioUpload = async (e) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append('audio', file);

//     setLoading(true);
//     setErrorMessage('');
//     try {
//       const response = await fetch('http://127.0.0.1:5000/api/audio-to-text', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       setAudioText(data.text);
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('Error occurred while processing the audio.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTextToAudio = async () => {
//     setLoading(true);
//     setErrorMessage('');
//     try {
//       const response = await fetch('http://127.0.0.1:5000/api/text-to-audio', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text: imageText || audioText }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch audio');
//       }

//       const blob = await response.blob();
//       const audioUrl = URL.createObjectURL(blob);
//       setAudioUrl(audioUrl); // Set the audio URL to be used for playback
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('Failed to convert text to audio.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="my-5">
//       <Row className="justify-content-center">
//         <Col md={8}>
//           <Card className="p-4 shadow-lg">
//             <Card.Body>
//               <h1 className="text-center mb-4">Image & Audio to Text Conversion</h1>

//               {/* Image Upload Section */}
//               <div className="mb-4">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="form-control mb-2"
//                 />
//                 <div>
//                   <h4>Converted Text from Image:</h4>
//                   <p>{imageText || 'No text converted yet'}</p>
//                 </div>
//               </div>

//               {/* Audio Upload Section */}
//               <div className="mb-4">
//                 <input
//                   type="file"
//                   accept="audio/*"
//                   onChange={handleAudioUpload}
//                   className="form-control mb-2"
//                 />
//                 <div>
//                   <h4>Transcription from Audio:</h4>
//                   <p>{audioText || 'No transcription yet'}</p>
//                 </div>
//               </div>

//               {/* Error Message */}
//               {errorMessage && (
//                 <div className="alert alert-danger">{errorMessage}</div>
//               )}

//               {/* Convert text to audio */}
//               {(imageText || audioText) && (
//                 <Button
//                   variant="primary"
//                   onClick={handleTextToAudio}
//                   disabled={loading}
//                   className="w-100"
//                 >
//                   {loading ? (
//                     <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
//                   ) : (
//                     'Convert to Audio'
//                   )}
//                 </Button>
//               )}

//               {/* Audio Playback */}
//               {audioUrl && (
//                 <div className="mt-3">
//                   <audio controls src={audioUrl} className="w-100"></audio>
//                 </div>
//               )}

//               {/* Loading Indicator */}
//               {loading && !audioUrl && (
//                 <div className="text-center mt-3">
//                   <Spinner animation="border" variant="primary" />
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default App;





