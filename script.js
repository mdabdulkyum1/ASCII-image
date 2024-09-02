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

    const desiredWidth = 100; 
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

    document.getElementById('ascii-art').textContent = asciiArt;
}
