import { CLOUDINARY_CONFIG } from "../config/cloudinary";

export const uploadComplaintImage = async (file) => {

    if (!file) {
        throw new Error("No file selected.");
    }

    const formData = new FormData();


    formData.append(
        "file",
        file
    );

    formData.append(
        "upload_preset",
        CLOUDINARY_CONFIG.uploadPreset
    );

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
        {
            method: "POST",
            body: formData,
        }
    );


    let data;

    try {

        data = await response.json();

    } catch {

        throw new Error(
            "Invalid response received from Cloudinary."
        );

    }


    if (!response.ok) {

        throw new Error(
            data?.error?.message ||
            "Cloudinary upload failed."
        );

    }


    if (!data?.secure_url) {

        throw new Error(
            "Cloudinary did not return a secure URL."
        );

    }


    return data.secure_url;
};