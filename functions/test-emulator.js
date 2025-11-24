const http = require('http');

const EMULATOR_URL = 'http://localhost:5001/inspir-ed-tal/us-central1/transcribeAndSummarize';

async function testTranscription() {
  console.log('\n🧪 Testing Cloud Function with Emulator...\n');
  
  const mockAudioData = Buffer.from('mock-audio-data-for-testing').toString('base64');
  
  const payload = {
    audioData: mockAudioData,
    mimeType: 'audio/mp4',
    doctorName: 'Dr. Test',
    readingLevel: 8
  };

  const data = JSON.stringify(payload);

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/inspir-ed-tal/us-central1/transcribeAndSummarize',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  try {
    console.log('📤 Sending request to emulator...');
    console.log(`URL: ${EMULATOR_URL}`);
    console.log(`Payload size: ${mockAudioData.length} bytes`);
    console.log(`Reading level: ${payload.readingLevel}`);
    
    const response = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode,
              data: JSON.parse(body)
            });
          } catch (e) {
            reject(new Error(`Invalid JSON response: ${body}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });

    console.log('\n✅ SUCCESS!');
    console.log(`Status: ${response.status}`);
    console.log(`Correlation ID: ${response.data.correlationId}`);
    console.log('\n📝 Response Data:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('\n❌ ERROR!');
    console.error('Error message:', error.message);
    process.exit(1);
  }
}

console.log('🚀 Firebase Emulator Test Script');
console.log('================================\n');
console.log('Make sure the emulator is running with:');
console.log('  firebase emulators:start\n');

setTimeout(testTranscription, 2000);
