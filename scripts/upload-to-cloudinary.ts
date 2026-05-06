// scripts/upload-to-cloudinary.ts
/**
 * Bulk upload images to Cloudinary
 * Run with: npx ts-node scripts/upload-to-cloudinary.ts
 */

import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a single file to Cloudinary
 */
async function uploadFile(
  filePath: string,
  folder: string,
  publicId?: string
): Promise<void> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `skin-essential-plus/${folder}`,
      public_id: publicId,
      overwrite: true,
      resource_type: 'auto',
    });

    console.log(`✓ Uploaded: ${result.secure_url}`);
  } catch (error) {
    console.error(`✗ Failed to upload ${filePath}:`, error);
  }
}

/**
 * Upload all images from a directory
 */
async function uploadDirectory(
  dirPath: string,
  cloudinaryFolder: string
): Promise<void> {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively upload subdirectories
      await uploadDirectory(filePath, `${cloudinaryFolder}/${file}`);
    } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
      // Upload image files
      const publicId = path.parse(file).name; // filename without extension
      await uploadFile(filePath, cloudinaryFolder, publicId);
    }
  }
}

/**
 * Main upload function
 */
async function main() {
  console.log('🚀 Starting Cloudinary upload...\n');

  const uploadTasks = [
    // Products
    { local: 'public/images/products', cloudinary: 'products' },
    
    // Services
    { local: 'public/images/services', cloudinary: 'services' },
    
    // Gallery
    { local: 'public/images/gallery', cloudinary: 'gallery' },
    
    // Homepage
    { local: 'public/images/homepage-hero', cloudinary: 'homepage/hero' },

     { local: 'public/images/homepage', cloudinary: 'homepage/hero' },
    
    // Branding
    { local: 'public/images', cloudinary: 'branding', files: ['skin-essential-transparent.png', 'logo.png'] },
  ];

  for (const task of uploadTasks) {
    console.log(`\n📁 Uploading ${task.local} → ${task.cloudinary}`);
    
    if (fs.existsSync(task.local)) {
      if (task.files) {
        // Upload specific files
        for (const file of task.files) {
          const filePath = path.join(task.local, file);
          if (fs.existsSync(filePath)) {
            await uploadFile(filePath, task.cloudinary, path.parse(file).name);
          }
        }
      } else {
        // Upload entire directory
        await uploadDirectory(task.local, task.cloudinary);
      }
    } else {
      console.log(`⚠ Directory not found: ${task.local}`);
    }
  }

  console.log('\n✅ Upload complete!');
  console.log('\n📊 View your images at:');
  console.log(`https://cloudinary.com/console/media_library/folders/skin-essential-plus`);
}

// Run the script
main().catch(console.error);