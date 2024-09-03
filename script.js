const asciiChars = '@#S%?*+;:,. '; // Characters from dark to light

document.getElementById('upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            createAsciiArt(img);
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
});

function createAsciiArt(img) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const displayWidth = window.innerWidth;
    const desiredWidth = 250; 
    const aspectRatio = img.height / img.width;
    const width = desiredWidth;
    const height = Math.floor(desiredWidth * aspectRatio);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let asciiArt = '';

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        const gray = Math.floor((r + g + b) / 3);
        const charIndex = Math.floor(gray / 255 * (asciiChars.length - 1));
        const asciiChar = asciiChars[charIndex];
        
        asciiArt += asciiChar;
        
        if ((i / 4 + 1) % width === 0) {
            asciiArt += '\n';
        }
    }

    // Display ASCII art
    document.getElementById('ascii-art').textContent = asciiArt;

    // Show the download button
    document.getElementById('download').style.display = 'inline-block';
    
    // Set up download functionality
    document.getElementById('download').onclick = function() {
        const imageURL = textToImage(asciiArt);
        downloadImage(imageURL);
    };
}

function textToImage(asciiArt) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Estimate canvas size based on ASCII art
    const lines = asciiArt.split('\n');
    const lineHeight = 12; // Adjust based on font size
    const maxLineLength = Math.max(...lines.map(line => line.length));
    canvas.width = maxLineLength * 10; // Adjust font size
    canvas.height = lines.length * lineHeight;

    ctx.font = '10px monospace'; // Adjust font size as needed
    ctx.fillStyle = '#f72'; // Adjust text color as needed

    // Draw ASCII art
    lines.forEach((line, index) => {
        ctx.fillText(line, 0, (index + 1) * lineHeight);
    });

    return canvas.toDataURL('image/png');
}

function downloadImage(dataURL) {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'ascii-art.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}