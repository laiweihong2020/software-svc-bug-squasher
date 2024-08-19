import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req) {
    try {
        const body = await req.json();
        const { username } = body;

        if (!username) {
            throw new Error("Username is required");
        }

        // Define the path for the new directory
        const dirPath = path.join(process.cwd(), 'public', 'resource', username);

        // Check if the directory already exists
        try {
            await fs.access(dirPath);
            console.log(`Directory already exists at: ${dirPath}`);
            return new Response(JSON.stringify({ message: 'Directory already exists' }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            // Directory does not exist, proceed to create it
        }

        // Create the new directory
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`Directory created at: ${dirPath}`);

        // Define the source directory
        const sourceDir = path.join(process.cwd(), 'public', 'resource', 'snake');

        // Read files from the source directory
        const files = await fs.readdir(sourceDir);

        // Copy each file to the new directory
        for (const file of files) {
            const sourceFile = path.join(sourceDir, file);
            const destFile = path.join(dirPath, file);
            await fs.copyFile(sourceFile, destFile);
        }
        console.log(`Files copied from ${sourceDir} to ${dirPath}`);

        return new Response(JSON.stringify({ message: 'Directory created and files copied successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(`Error creating directory or copying files: ${error.message}`);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}