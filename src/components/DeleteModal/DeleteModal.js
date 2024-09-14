import React from 'react';
import toast from 'react-hot-toast';

const DeleteModal = ({ employee, setDeleteEmployee, refetch }) => {
    const handleDeleteEmployee = () => {
        fetch(`http://localhost:5000/employee/${employee._id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    // refetch();
                    toast.success(`Employee Delete successfully`)
                    setDeleteEmployee(null);
                    refetch();
                }
            })
    }

    const closeModal = (name) => {
        // Get the modal element
        const modal = document.getElementById(name);

        // Hide the modal
        modal.close();
    };
    return (
        <div>
            <input type="checkbox" id="delete-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="delete-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h2 className="text-md text-red-500 mt-5 text-xl text-center font-semibold">Do You Relly Want to Delete {employee.name}!!</h2>

                    <div className='text-right mt-10'>
                        <span className='btn btn-success text-white mr-5' onClick={() => setDeleteEmployee(null)}>No</span>
                        <span className='btn btn-error text-white' onClick={handleDeleteEmployee}>Delete</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;