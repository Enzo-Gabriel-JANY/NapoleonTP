const fs = require('fs');
const path = require('path');

// Fonction pour lire et encoder une image en base64
const encodeImageToBase64 = (filePath) => {
    const image = fs.readFileSync(filePath);
    return Buffer.from(image).toString('base64');
};

// Lire le fichier JSON
const jsonFilePath = path.join(__dirname, 'db.json');
const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
const data = JSON.parse(jsonData);

// Dossier contenant les images
const imagesDir = path.join(__dirname, 'src/NapoleonImage');

// Ajouter l'image encodée en base64 à chaque bataille
data.bataille.forEach(bataille => {
    const imageFilePath = path.join(imagesDir, `${bataille.id}.jpg`);
    if (fs.existsSync(imageFilePath)) {
        const base64Image = encodeImageToBase64(imageFilePath);
        bataille.image = `data:image/jpeg;base64,${base64Image}`;
    } else {
        console.log(`Image not found for bataille id: ${bataille.id}`);
    }
});

// Écrire les modifications dans le fichier JSON
fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Images have been encoded to base64 and added to db.json');
