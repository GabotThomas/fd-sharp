
const express = require('express');
const sharp = require('sharp');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send('<h1>Bienvenue sur sharp</h1>');
});

app.get('/info', (req, res) => {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send('<h1>Bienvenue sur sharp</h1>');
});

app.post('/metadata', express.json({ limit: '20mb' }), async (req, res) => {
    if (!req.body) {
        return res.status(400).send('No image are sended.');
    }
  
    try { 
        // convert array buffer to buffer
        const imageBuffer = Buffer.from(req.body.image.data);


        // Traiter l'image avec sharp
        let processedImage = null;
        try{
          processedImage = sharp(imageBuffer);
        }catch(error){
            console.log('error', error.slice(0, 100) ,"...", error.slice(-100));
          return res.status(500).send('Error processing the image.');
        }
        
        // get the metadata of the image
        const metadata = await processedImage.metadata();
        
        res.send(JSON.stringify(metadata));
    } catch (error) {
      res.status(500).send('Error processing the image.');
    }
  });

app.post('/resize/:size', express.json({  limit: '20mb' }), async (req, res) => {

    const size = parseInt(req.params.size);
    
    if (!req.body || isNaN(size)) {
        return res.status(400).send('No image or invalid size.');
    }
  
    try {
      const imageBuffer = Buffer.from(req.body.image.data);
      let processedImage = null;
      try{
         processedImage = await sharp(imageBuffer)
            .resize(size) // Exemple de redimensionnement
            .toBuffer();
      }catch(error){
            console.error(error);
            // console.log('error', error.slice(0, 100) ,"...", error.slice(-100));
            return res.status(500).send('Error processing the image.');
      }


        res.send(JSON.stringify({image: processedImage}));

    } catch (error) {
        console.log("err",error);
        res.status(500).send('Error processing the image.');
    }
  });

app.listen(3000);