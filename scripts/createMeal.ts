import { promises as fs } from 'fs';
import path from 'path';

const API_URL = 'https://foodiary.rinaldocar.com.br/meals';
const TOKEN = 'eyJraWQiOiIxbytxbjhKVVg4eXhacFFZbEI0anE3bFk2QUFHSVlXMTBZQjMxUVwvbjlIRT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2MzBjZmEyYS03MDMxLTcwMjMtNzUxMS02ZjE3MTBiYmU2ZDUiLCJpbnRldGVybmFsSWQiOiIyejdPZ1A2Z3JpQ0FYOWE4eUJaVmpHNFBTNzAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3NhLWVhc3QtMV83MEZXY3lrUkciLCJjbGllbnRfaWQiOiI0cmxyYjZrYXVzZWMxdHI5ZTRic3Z0cHJoOCIsIm9yaWdpbl9qdGkiOiIxNTEwMzdlZi1jNWM2LTRhYjYtOWIzZS1hNjJjNzc3ODUwOGIiLCJldmVudF9pZCI6IjMxYmEyMWM0LTY5NmQtNDhhOS1iZmEzLTA1Mjg0ZjdiODcwZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NTE4MjIwOTYsImV4cCI6MTc1MTg2NTI5NiwiaWF0IjoxNzUxODIyMDk2LCJqdGkiOiI1Y2NjOTVkZC0zNDkxLTRjOWYtODg3Yi1hMGZjMjI2NzVjODUiLCJ1c2VybmFtZSI6IjYzMGNmYTJhLTcwMzEtNzAyMy03NTExLTZmMTcxMGJiZTZkNSJ9.D2oNLE-OlppmVFLEDhCKQJHqXDykzk-ES_ypC2r26PfwBNFs3pqASzMBqBVJJ_9wMDClX-nUW4ck2R_L-5dqb_YhK5FpY5NrcQtNwBN0AC-124U8vFbL-9m8wsY7fFjj2ci1Jy-nLXgHgIufpV5kvn88xUC69qi-VHOSAETTKA9-gZHF4DBmIrIMd698xG3CzPoSRLDCq4AauLjY8U07eTXuqT8O53NF_ceNj_aqrwR-lmW4K4ClMnMPvymwdK5GVMHcXg9MapB_-H0YWZnE2KBVss4RHTDKY9ajD52Lz-4vAQ9s-uNcpU1wWEAxvhknWlOYOSGfoLUSvC0tYsyjcw';

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

