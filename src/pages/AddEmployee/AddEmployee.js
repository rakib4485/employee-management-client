// src/pages/AddEmployee/AddEmployee.js

import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Resizer from 'react-image-file-resizer';
import Cropper from 'react-easy-crop';
import getCroppedImg from './getCroppedImg'; // Helper function we'll create next
import "react-day-picker/style.css";
import './AddEmployee.css'; // Optional: Create a CSS file for styling
import { format } from 'date-fns';

const AddEmployee = () => {
    // State variables
    const [imageSrc, setImageSrc] = useState(null); // Original uploaded image
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // Cropped area in pixels
    const [croppedImage, setCroppedImage] = useState(null); // Cropped image blob
    const [crop, setCrop] = useState({ x: 0, y: 0 }); // Crop position
    const [zoom, setZoom] = useState(1); // Zoom level

    // Handle file input change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result); // Set image source for cropping
            };
            reader.readAsDataURL(file);
        }
    };

    // Capture the crop area
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Generate the cropped image
    const handleCropConfirm = useCallback(async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            setCroppedImage(croppedImageBlob); // Store the cropped image blob
        } catch (e) {
            console.error("Error cropping the image", e);
            toast.error("Failed to crop the image.");
        }
    }, [imageSrc, croppedAreaPixels]);

    // Resize the image before uploading
    const resizeImage = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                300, // Max width
                300, // Max height
                'JPEG', // Output format
                70, // Quality (0-100)
                0, // Rotation angle
                (uri) => {
                    resolve(uri);
                },
                'blob' // Output type, change to 'base64' if required
            );
        });

    // Handle form submission
    const handleUpload = async (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const phone = form.phone.value;
        let bDate = form.bDate?.value;

        // Check if bDate is a valid date and format it
        if (bDate && !isNaN(new Date(bDate))) {
            bDate = format(new Date(bDate), 'PP');
        } else {
            bDate = null;
        }

        if (!croppedImage) {
            toast.error("Please crop the image before submitting.");
            return;
        }

        // Resize the cropped image before uploading
        const resizedImage = await resizeImage(croppedImage);

        const data = new FormData();
        data.append("file", resizedImage);
        data.append("upload_preset", "rentGo");
        data.append("cloud_name", "dunquub4z");

        fetch("https://api.cloudinary.com/v1_1/dunquub4z/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                if (data.url) {
                    const userInfo = {
                        image: data.url,
                        name,
                        email,
                        phone,
                        bDate
                    };

                    fetch(`http://localhost:5000/employee`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userInfo)
                    })
                        .then(res => res.json())
                        .then(data => {
                            toast.success("Employee added successfully");
                            form.reset();
                            setImageSrc(null);
                            setCroppedImage(null);
                        })
                        .catch((error) => {
                            console.error("Error while saving employee data", error);
                            toast.error("Failed to save employee data.");
                        });
                }
            })
            .catch((error) => {
                console.error("Error while uploading image", error);
                toast.error("Image upload failed.");
            });
    };

    return (
        <div>
            <h2 className='text-3xl font-bold my-5 underline'>Add Employee</h2>
            <form onSubmit={handleUpload} className='flex flex-col gap-2 border rounded-md p-5 my-5 shadow-md'>
                {/* Name Field */}
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Full Name</label></div>
                    <div className="col-span-3">
                        <input type="text" name='name' className='input input-bordered input-blue-400 w-full' required />
                    </div>
                </div>
                {/* Email Field */}
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Email</label></div>
                    <div className="col-span-3">
                        <input type="email" name='email' className='input input-bordered input-blue-400 w-full' required />
                    </div>
                </div>
                {/* Phone Field */}
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Phone</label></div>
                    <div className="col-span-3">
                        <input type="text" name='phone' className='input input-bordered input-blue-400 w-full' required />
                    </div>
                </div>
                {/* Date of Birth Field */}
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Date of Birth</label></div>
                    <div className="col-span-3">
                        <input type="date" name='bDate' className="input input-bordered w-full" required />
                    </div>
                </div>
                {/* Image Upload Field */}
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Image</label></div>
                    <div className="col-span-3">
                        <input
                            type="file"
                            name='image'
                            accept="image/*"
                            onChange={handleFileChange}
                            className='input input-bordered input-blue-400 w-full'
                            required
                        />
                    </div>
                </div>

                {/* Image Cropper */}
                {imageSrc && !croppedImage && (
                    <div className="crop-container">
                        <div className="relative w-full h-64 bg-gray-200 mt-4">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // Square aspect ratio
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                cropShape="round" // Circular crop shape
                                showGrid={false}
                            />
                        </div>
                        <div className="flex justify-center mt-4">
                            <button type="button" onClick={handleCropConfirm} className="btn btn-secondary">
                                Confirm Crop
                            </button>
                        </div>
                    </div>
                )}

                {/* Cropped Image Preview */}
                {croppedImage && (
                    <div className="flex flex-col items-center mt-4">
                        <h3 className="font-semibold mb-2">Cropped Image Preview:</h3>
                        <img
                            src={URL.createObjectURL(croppedImage)}
                            alt="Cropped"
                            className="border rounded-full h-40 w-40 object-cover"
                        />
                    </div>
                )}

                {/* Submit Button */}
                <input type="submit" value='Submit' className='btn btn-primary mt-4' />
            </form>
        </div>
    );
};

export default AddEmployee;
