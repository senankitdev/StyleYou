import sharp from 'sharp';
import { BodyParameters } from './measurementMapper';

/**
 * Renders the base body from parameters using a parameterized SVG template,
 * attaches the face, and exports a PNG image buffer using sharp.
 */
export async function renderAvatarBody(
  faceBuffer: Buffer,
  params: BodyParameters,
  gender: string
): Promise<Buffer> {
  // SVG dimensions
  const width = 400;
  const height = 800;

  // Base dimensions adjusted by ratios
  const baseHeadSize = 80;
  
  // Calculate body segment widths and positions
  // Center is x=200
  const shoulderW = 120 * params.shoulderRatio;
  const chestW = 110 * params.chestRatio;
  const waistW = 90 * params.waistRatio;
  const hipW = 120 * params.hipRatio;
  
  // Vertical positions adjusted by height ratio
  const hScale = params.heightRatio;
  
  const headY = 50;
  const shoulderY = headY + 70 + (20 * hScale);
  const chestY = shoulderY + (60 * hScale);
  const waistY = chestY + (80 * hScale);
  const hipY = waistY + (60 * hScale);
  const legY = hipY + (200 * hScale);
  
  // Create the parameterized SVG string
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EAD1BB" />
          <stop offset="100%" stop-color="#D5B095" />
        </linearGradient>
      </defs>
      
      <!-- Body Path -->
      <path d="
        M ${200 - shoulderW/2} ${shoulderY}
        Q 200 ${shoulderY - 20} ${200 + shoulderW/2} ${shoulderY}
        C ${200 + chestW/2} ${chestY}, ${200 + waistW/2} ${waistY}, ${200 + hipW/2} ${hipY}
        L ${200 + hipW/2.5} ${legY}
        L ${200 + 10} ${legY}
        L 200 ${hipY + 50}
        L ${200 - 10} ${legY}
        L ${200 - hipW/2.5} ${legY}
        C ${200 - waistW/2} ${waistY}, ${200 - chestW/2} ${chestY}, ${200 - shoulderW/2} ${shoulderY}
        Z
      " fill="url(#skin)" />
      
      <!-- Arms -->
      <path d="
        M ${200 - shoulderW/2 + 10} ${shoulderY + 10}
        L ${200 - shoulderW/2 - 20} ${waistY + 50}
        L ${200 - shoulderW/2 - 10} ${waistY + 50}
        L ${200 - shoulderW/2 + 15} ${shoulderY + 30}
      " fill="url(#skin)" />
      <path d="
        M ${200 + shoulderW/2 - 10} ${shoulderY + 10}
        L ${200 + shoulderW/2 + 20} ${waistY + 50}
        L ${200 + shoulderW/2 + 10} ${waistY + 50}
        L ${200 + shoulderW/2 - 15} ${shoulderY + 30}
      " fill="url(#skin)" />
    </svg>
  `;

  // First, process the face buffer to be a circle/rounded
  const processedFace = await sharp(faceBuffer)
    .resize(baseHeadSize, baseHeadSize, { fit: 'cover', position: 'top' })
    .toBuffer();

  // Then composite the face onto the SVG body
  const finalImage = await sharp(Buffer.from(svg))
    .composite([
      {
        input: processedFace,
        top: Math.round(headY),
        left: Math.round(200 - baseHeadSize / 2),
      },
    ])
    .png()
    .toBuffer();

  return finalImage;
}
