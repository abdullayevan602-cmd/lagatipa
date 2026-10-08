import { LogoConfig } from '../types/logo';

export function serializeSvgElement(svgEl: SVGSVGElement): string {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '1024');
  clone.setAttribute('height', '1024');
  const serializer = new XMLSerializer();
  return serializer.serializeToString(clone);
}

export function downloadSvgFile(svgEl: SVGSVGElement, fileName: string) {
  const svgString = serializeSvgElement(svgEl);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerBrowserDownload(url, `${fileName}.svg`);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

export async function downloadRasterFile(
  svgEl: SVGSVGElement,
  config: LogoConfig,
  options: {
    format: 'png' | 'jpg';
    width: number;
    height: number;
    fileName: string;
  }
): Promise<void> {
  const { format, width, height, fileName } = options;

  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '1024');
  clone.setAttribute('height', '1024');

  // If exporting JPG or non-transparent PNG on a banner canvas, handle background
  const svgString = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas context not available'));
          return;
        }

        // Fill background for JPG or wide 16:9 banner when not transparent
        if (format === 'jpg' || (!config.transparentBg && width !== height)) {
          ctx.fillStyle = config.bgColor || '#070E1A';
          ctx.fillRect(0, 0, width, height);
        }

        // Center the 1:1 logo inside the target aspect ratio (e.g. 16:9 banner or 1:1 square)
        const size = Math.min(width, height);
        const offsetX = Math.round((width - size) / 2);
        const offsetY = Math.round((height - size) / 2);

        ctx.drawImage(img, offsetX, offsetY, size, size);
        URL.revokeObjectURL(url);

        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const dataUrl = canvas.toDataURL(mimeType, 0.96);
        triggerBrowserDownload(dataUrl, `${fileName}.${format}`);
        resolve();
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

function triggerBrowserDownload(href: string, downloadName: string) {
  const link = document.createElement('a');
  link.href = href;
  link.download = downloadName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
