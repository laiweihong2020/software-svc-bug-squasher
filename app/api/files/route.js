import fs from 'fs';
import path from 'path';

export async function GET(req) {
  const directoryPath = path.join(process.cwd(), 'public', 'resource', 'snake');
  try {
    const files = await fs.promises.readdir(directoryPath);
    return new Response(JSON.stringify({ files }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error reading directory' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}