function getImageExtension(base64String) {
  const matches = base64String.match(/^data:image\/([^;]+);base64,/);
  if (matches && matches[1]) {
    const mimeType = matches[1];
    let extension = "";
    switch (mimeType) {
      case "png":
        extension = ".png";
        break;
      case "jpeg":
      case "jpg":
        extension = ".jpg";
        break;
      case "gif":
        extension = ".gif";
        break;
      case "webp":
        extension = ".webp";
        break;
      case "bmp":
        extension = ".bmp";
        break;
      case "svg+xml":
        extension = ".svg";
        break;
      default:
        extension = "";
        break;
    }
    return extension;
  } else {
    throw new Error("Invalid Base64 image string");
  }
}

module.exports = { getImageExtension };