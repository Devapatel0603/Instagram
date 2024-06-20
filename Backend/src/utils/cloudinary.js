import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({
    path: "./.env",
});

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (localFilePath) => {
    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(
            localFilePath.path,
            {
                resource_type: "auto",
            }
        );

        // Capture the URL of the uploaded image
        const imageUrl = uploadResult.secure_url;

        fs.unlinkSync(localFilePath.path);

        // Return the URL of the uploaded image
        return imageUrl;
    } catch (error) {
        return null;
    }
};

export const getPublicIdFromUrl = async (url) => {
    try {
        // Use the url method from the Cloudinary SDK to parse the URL
        const result = await cloudinary.url(url);

        // Extract the public_id from the result
        const publicId = result.public_id;

        return publicId;
    } catch (error) {
        return null;
    }
};

export const deleteFromCloudInary = async (public_ids) => {};
