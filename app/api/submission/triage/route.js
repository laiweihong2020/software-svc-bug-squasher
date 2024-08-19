import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  const { content, username } = await request.json();

  // Defint the file path
  const filePath = path.join(process.cwd(), 'public', 'resource', `${username}`, 'triage.html');
  
  try {
    // Ensure the submissions directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Write the content to the file
    await fs.writeFile(filePath, content, 'utf8');

    return NextResponse.json({ message: 'Triage content submitted successfully', content });
  } catch (error) {
    return NextResponse.json({ message: 'Error writing content to file', error: error.message }, { status: 500 });
  }
}