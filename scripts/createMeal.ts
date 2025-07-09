import { promises as fs } from 'fs';
import path from 'path';

const API_URL = 'https://foodiary.rinaldocar.com.br/meals';
const TOKEN = 'eyJraWQiOiIxbytxbjhKVVg4eXhacFFZbEI0anE3bFk2QUFHSVlXMTBZQjMxUVwvbjlIRT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2MzBjZmEyYS03MDMxLTcwMjMtNzUxMS02ZjE3MTBiYmU2ZDUiLCJpbnRldGVybmFsSWQiOiIyejdPZ1A2Z3JpQ0FYOWE4eUJaVmpHNFBTNzAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3NhLWVhc3QtMV83MEZXY3lrUkciLCJjbGllbnRfaWQiOiI0cmxyYjZrYXVzZWMxdHI5ZTRic3Z0cHJoOCIsIm9yaWdpbl9qdGkiOiI5ZTE0NDJlMC05OTlmLTRiZWEtOGU0MC0wNGIyNWMyNGNkY2MiLCJldmVudF9pZCI6IjM5NTM5ODk1LTg2ZTItNDAyZC04MjY3LTUwMjA4NjNiZGMyZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NTIwODc4NzYsImV4cCI6MTc1MjEzMTA3NiwiaWF0IjoxNzUyMDg3ODc2LCJqdGkiOiJjZTQxMzI2Mi02N2VjLTRkYTEtOGM2OS0yODQyOTdmZjQwNjIiLCJ1c2VybmFtZSI6IjYzMGNmYTJhLTcwMzEtNzAyMy03NTExLTZmMTcxMGJiZTZkNSJ9.Vuz2LCLAnW1V2eOT2Kfj4rylV0hKJ98tCDNwVjVfpfxxJheSVtF79eY7r3rKWt7iIsUaK9_RsUDTNIWb5SP8efJHPH-4oqJEsyYxwNuCVbQejyElTIueTImuZ7U2c69DCSgCGQWewhFKWYFnpQAjnjizgpM9OJ4lpDPqitY-1734glYWGs4lxiv3GD8GMtCBoRaxHh4mYipHJjvWe8V_ja0ulkr-saowqLMfqBcr8q45D3tofQxUpbbYh-UWqgpP9R69YQHhXLF-NPq5PtkJkrR17BaKB9a2HmYbWXy5mrsiGjVGoJe75GE96J8Q9BoOQSpMBJ3CtRU6aLUIL8pKxg';

interface IPresignedResponse {
  uploadSignature: string;
};

interface IPresignedDecoded {
  url: string;
  fields: Record<string, string>;
};

async function readImageFile(filePath: string): Promise<{
  data: Buffer;
  size: number;
  inputType: string;
}> {
  console.log(`🔍 Reading File from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    inputType: 'image/jpeg',
  };
}

async function createMeal(
  fileType: string,
  fileSize: number,
): Promise<IPresignedDecoded> {
  console.log(`🚀 requesting presigned post for ${fileSize} bytes of type ${fileType}`);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ file: { inputType: fileType, size: fileSize } }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as IPresignedResponse;

  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, 'base64').toString('utf-8'),
  ) as IPresignedDecoded;

  console.log('✅ Received presigned POST data');
  return decoded;
}

function buildFormatData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string,
): FormData {
  console.log(`📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`);
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }

  const blob = new Blob([fileData], { type: fileType });
  form.append('file', blob, filename);
  return form;
}

async function uploadToS3( url: string, form: FormData): Promise<void> {
  console.log(`🎂 Uploading to S3 at ${url}`);
  const res = await fetch(url, {
    method: 'POST',
    body: form,
  });

  if(!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText} - ${text}`);
  }

  console.log('🍕 Upload conpleted successfully');
}

async function uploadMealImage(filePath: string): Promise<void> {
  try {
    const { data, size, inputType } = await readImageFile(filePath);
    const { url, fields } = await createMeal(inputType, size);
    const form = buildFormatData(fields, data, path.basename(filePath), inputType);

    await uploadToS3(url, form);
  } catch (err) {
    console.error('❌ Error during uploadMealImage', err);

    throw err;
  }
}

uploadMealImage(
  path.resolve(__dirname,'assets', 'cover.jpg'),
).catch(() => process.exit(1));

