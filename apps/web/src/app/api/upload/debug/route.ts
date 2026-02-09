import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // Test configuration
    const config = {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
      api_key: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing', 
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing',
    };

    // Test connection
    const result = await cloudinary.api.ping();
    
    return NextResponse.json({
      config,
      connection: '✅ Connected to Cloudinary',
      ping: result
    });
  } catch (error) {
    return NextResponse.json({
      error: '❌ Cloudinary connection failed',
      details: error.message
    }, { status: 500 });
  }
}
