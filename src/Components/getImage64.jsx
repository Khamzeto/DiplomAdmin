export default async function getCroppedImg64(imageSrc, pixelCrop, rotation = 0) {
  const image = new Image();
  image.src = imageSrc;
  await new Promise(r => {
    image.onload = r;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let canvasWidth, canvasHeight;
  if (rotation === 90 || rotation === 270) {
    canvasWidth = pixelCrop.height;
    canvasHeight = pixelCrop.width;
  } else {
    canvasWidth = pixelCrop.width;
    canvasHeight = pixelCrop.height;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  if (rotation === 90 || rotation === 270) {
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
  } else {
    // Устанавливаем поворот
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
  }
  // Рассчитываем координаты вырезаемой области с учетом поворота
  let cropX, cropY;
  if (rotation === 90) {
    cropX = pixelCrop.y;
    cropY = image.height - pixelCrop.x - pixelCrop.width;
  } else if (rotation === 180) {
    cropX = image.width - pixelCrop.x - pixelCrop.width;
    cropY = image.height - pixelCrop.y - pixelCrop.height;
  } else if (rotation === 270) {
    cropX = image.width - pixelCrop.y - pixelCrop.height;
    cropY = pixelCrop.x;
  } else {
    cropX = pixelCrop.x;
    cropY = pixelCrop.y;
  }

  // Рисуем изображение с учетом поворота и вырезаемой области
  ctx.drawImage(
    image,
    cropX,
    cropY,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Получаем данные изображения в формате base64
  const base64Image = canvas.toDataURL('image/jpeg');

  // Возвращаем строку base64
  return base64Image;
}
