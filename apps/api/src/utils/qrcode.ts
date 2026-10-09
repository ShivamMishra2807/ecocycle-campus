import QRCode from 'qrcode';

export async function generateDeviceQRCodeDataURL(assetNumber: string): Promise<string> {
  const payloadUrl = `http://localhost:3000/device/${assetNumber}`;
  return await QRCode.toDataURL(payloadUrl, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#064e3b',
      light: '#ffffff',
    },
  });
}
