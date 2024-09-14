import React from 'react';
// import { DayPicker } from 'react-day-picker';
import toast from 'react-hot-toast';

const EditModal = ({emplyee, setSelectEmployee, refetch}) => {
    const handleUpload = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const phone = form.phone.value;
        const image = form.image.value;
        // const bDate = date
        if(image){
            const image = event.target.image.files[0];
        const data = new FormData();
        data.append("file", image)
        data.append("upload_preset", "rentGo")
        data.append("cloud_name", "dunquub4z")

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
                        // bDate
                    }


                    fetch(`http://localhost:5000/employee?id=${emplyee._id}`, {
                        method: 'PUT',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(userInfo)
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data)
                            toast.success("Employee update successfully");
                            form.reset();
                            setSelectEmployee(null)
                            refetch()
                        })


                }
            })
        }else{
            const userInfo = {
                image: emplyee.image,
                name,
                email,
                phone,
                // bDate
            }


            fetch(`http://localhost:5000/employee?id=${emplyee._id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    toast.success("Employee update successfully");
                    form.reset();
                    refetch();
                    setSelectEmployee(null)
                    
                })
        }
    }
    return (
        <div>
            <input type="checkbox" id="edit-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="edit-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          {/* <h3 className="text-lg font-bold">{name}</h3>
          <p>{doctorEmail}</p> */}
          <h2 className='text-3xl font-bold my-5 underline'>Edit Emplyee</h2>
            <form onSubmit={handleUpload}  className='flex flex-col gap-2 border rounded-md p-5 my-5 shadow-md'>
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Full Name</label></div>
                    <div className="col-span-3">
                        <input type="text" name='name' defaultValue={emplyee?.name} className='input input-bordered input-blue-400 w-full' />
                    </div>
                </div>
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Email</label></div>
                    <div className="col-span-3">
                        <input type="text" name='email' defaultValue={emplyee?.email} className='input input-bordered input-blue-400 w-full' />
                    </div>
                </div>
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Phone</label></div>
                    <div className="col-span-3">
                        <input type="text" name='phone' defaultValue={emplyee?.phone} className='input input-bordered input-blue-400 w-full' />
                    </div>
                </div>
                
                <div className='grid grid-cols-4 items-center'>
                    <div><label className='font-semibold'>Image</label></div>
                    <div className="col-span-3">
                        <input type="file" name='image' className='input input-bordered input-blue-400 w-full' />
                    </div>
                </div>

                <input type="submit" value='Submit' className='btn btn-primary' />
            </form>
        </div>
      </div>
        </div>
    );
};

export default EditModal;