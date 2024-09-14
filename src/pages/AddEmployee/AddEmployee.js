import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { DayPicker } from "react-day-picker";
import { format } from 'date-fns';
import Resizer from 'react-image-file-resizer';
import "react-day-picker/style.css";

const AddEmployee = () => {
    const [selected, setSelected] = useState(new Date());
    const date = format(selected, 'PP');

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

    const handleUpload = async (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const phone = form.phone.value;
        // const bDate = date;
        const image = event.target.image.files[0];
        let bDate = form.bDate?.value;

        // Check if bDate is a valid date and format it, otherwise set it to null
        if (bDate && !isNaN(new Date(bDate))) {
            bDate = format(new Date(bDate), 'PP');
        } else {
            bDate = null;  // Or handle it in a way that fits your business logic
        }

        // Resize the image before uploading
        const resizedImage = await resizeImage(image);

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
                            console.log(data);
                            toast.success("Employee added successfully");
                            form.reset();
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
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Full Name</label></div>
                    <div className="col-span-3">
                        <input type="text" name='name' className='input input-bordered input-blue-400 w-full' required />
                    </div>
                </div>
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Email</label></div>
                    <div className="col-span-3">
                        <input type="email" name='email' className='input input-bordered input-blue-400 w-full' required />
                    </div>
                </div>
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Phone</label></div>
                    <div className="col-span-3">
                        <input type="text" name='phone' className='input input-bordered input-blue-400 w-full' required />
                    </div>
                </div>
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Date of Birth</label></div>
                    <div className="col-span-3">
                    <input type="date" name='bDate' placeholder="Date of Birth" className="input input-bordered w-full" required/>
                    </div>
                </div>
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Image</label></div>
                    <div className="col-span-3">
                        <input type="file" name='image' className='input input-bordered input-blue-400 w-full' required />
                    </div>
                </div>

                <input type="submit" value='Submit' className='btn btn-primary' />
            </form>
        </div>
    );
};

export default AddEmployee;
