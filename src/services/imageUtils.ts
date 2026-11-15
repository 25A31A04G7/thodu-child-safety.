// Synthetic child avatar generator (Zero real children's photos)
// Generates clean, recognizable synthetic vector portraits stored as safe Data URLs

export function createSyntheticAvatarSvg(name: string, gender: 'boy' | 'girl', shirtColor: string, skinTone: string = '#F6C8A4'): string {
  const isBoy = gender === 'boy';
  const hairColor = '#241a14';
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" fill="#E2E8F0" rx="24"/>
    <circle cx="100" cy="195" r="75" fill="${shirtColor}"/>
    <!-- Neck -->
    <rect x="88" y="125" width="24" height="25" fill="${skinTone}" rx="4"/>
    <!-- Head -->
    <ellipse cx="100" cy="95" rx="42" ry="48" fill="${skinTone}"/>
    <!-- Hair -->
    ${isBoy ? `
      <path d="M 58 85 C 58 50 142 50 142 85 C 135 65 115 56 100 56 C 85 56 65 65 58 85 Z" fill="${hairColor}"/>
      <path d="M 58 85 Q 52 105 60 115" stroke="${hairColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M 142 85 Q 148 105 140 115" stroke="${hairColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
    ` : `
      <path d="M 54 90 C 54 45 146 45 146 90 C 146 130 140 150 135 155 L 125 150 C 132 130 136 100 136 85 C 130 65 115 56 100 56 C 85 56 70 65 64 85 C 64 100 68 130 75 150 L 65 155 C 60 150 54 130 54 90 Z" fill="${hairColor}"/>
      <!-- Hair bows -->
      <circle cx="62" cy="72" r="7" fill="#F43F5E"/>
      <circle cx="138" cy="72" r="7" fill="#F43F5E"/>
    `}
    <!-- Ears -->
    <ellipse cx="58" cy="98" rx="7" ry="10" fill="${skinTone}"/>
    <ellipse cx="142" cy="98" rx="7" ry="10" fill="${skinTone}"/>
    <!-- Eyes -->
    <ellipse cx="84" cy="94" rx="4.5" ry="5.5" fill="#1E293B"/>
    <ellipse cx="116" cy="94" rx="4.5" ry="5.5" fill="#1E293B"/>
    <circle cx="86" cy="92" r="1.5" fill="#FFFFFF"/>
    <circle cx="118" cy="92" r="1.5" fill="#FFFFFF"/>
    <!-- Eyebrows -->
    <path d="M 77 84 Q 84 81 91 84" stroke="${hairColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M 109 84 Q 116 81 123 84" stroke="${hairColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Nose -->
    <path d="M 98 97 Q 100 105 103 105" stroke="#D97706" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Gentle Smile -->
    <path d="M 88 116 Q 100 126 112 116" stroke="#9A3412" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <!-- Cheeks blush -->
    <ellipse cx="76" cy="106" rx="6" ry="4" fill="#FCA5A5" opacity="0.6"/>
    <ellipse cx="124" cy="106" rx="6" ry="4" fill="#FCA5A5" opacity="0.6"/>
    <!-- Tilak / Bindi -->
    <circle cx="100" cy="82" r="2.5" fill="#DC2626"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Pre-generated synthetic pairs for testing & demo
// Fictional child: Raju Varma (5 yrs, yellow shirt)
export const DEMO_CHILD_PARENT_PHOTO = createSyntheticAvatarSvg('Raju Varma', 'boy', '#FACC15'); // bright yellow shirt
export const DEMO_CHILD_FOUND_PHOTO = createSyntheticAvatarSvg('Raju Varma (Found)', 'boy', '#F59E0B'); // slightly dimmer amber yellow shirt
export const DEMO_CHILD_PRIYA_PHOTO = createSyntheticAvatarSvg('Priya Reddy', 'girl', '#EC4899');

// Image compression utility
export async function compressImage(dataUrlOrFile: string | File, maxWidth: number = 600, quality: number = 0.75): Promise<string> {
  return new Promise((resolve) => {
    // If already an SVG data URL, return directly
    if (typeof dataUrlOrFile === 'string' && dataUrlOrFile.startsWith('data:image/svg+xml')) {
      return resolve(dataUrlOrFile);
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : '');
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };

    img.onerror = () => {
      resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : DEMO_CHILD_PARENT_PHOTO);
    };

    if (typeof dataUrlOrFile === 'string') {
      img.src = dataUrlOrFile;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(dataUrlOrFile);
    }
  });
}
