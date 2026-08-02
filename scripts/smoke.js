const https = require('https');
const url = 'https://portfolio-3d-opal-six.vercel.app';

https.get(url, (res) => {
  console.log('statusCode:', res.statusCode);
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    console.log('bodyLength:', body.length);
    console.log('containsCanvasOrThree:', /<canvas/i.test(body) || /three/i.test(body));
    console.log('containsHeadline:', body.includes('My 24/7 Autonomous AI Digital Employee'));
    console.log('containsProjectSnippet:', body.includes('3D Portfolio Experience'));
  });
}).on('error', (e) => {
  console.error('error', e && e.message);
  process.exit(1);
});
