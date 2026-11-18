export const uploadComplaintImage = async (file) => {
    if (!file) {
        throw new Error("No file selected.");
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration missing in .env (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET).");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error("Invalid response received from Cloudinary.");
    }

    if (!response.ok) {
        throw new Error(
            data?.error?.message || "Cloudinary upload failed."
        );
    }

    if (!data?.secure_url) {
        throw new Error("Cloudinary did not return a secure URL.");
    }

    return data.secure_url;
};
