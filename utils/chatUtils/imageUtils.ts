export const resizeAndCompressImage = async (
  file: File,
  maxWidth = 1500,
  quality = 0.8
): Promise<Blob> => {
  const reader = new FileReader();

  const imageDataURL = await new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject('파일 읽기 실패');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = imageDataURL;
  });

  const scale = Math.min(maxWidth / img.width, 1);
  const width = img.width * scale;
  const height = img.height * scale;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context 없음');

  ctx.drawImage(img, 0, 0, width, height);

  // 5. 파일 타입에 따라 압축 포맷 결정
  let outputMimeType: string;
  if (file.type === 'image/png') {
    outputMimeType = 'image/png';
    // PNG는 무손실 압축이므로 quality 인자는 무시됩니다.
  } else {
    // PNG가 아니면 JPEG로 압축 (image/jpeg, image/gif, image/webp 등 모두 JPEG로)
    outputMimeType = 'image/jpeg';
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject('Blob 생성 실패')),
      outputMimeType,
      quality
    );
  });

  return blob;
};

export const blobToBase64 = async (blob: Blob): Promise<string> => {
  const reader = new FileReader();

  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject('Base64 인코딩 실패');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  return base64;
};
