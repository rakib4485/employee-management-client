import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import EditModal from '../../components/EditModal/EditModal';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import { format } from 'date-fns';

const EmployeeShow = () => {

    const [selectEmployee, setSelectEmployee] = useState(null);
    const [deleteEmployee, setDeleteEmployee] = useState(null);
    const [employees, setEmployees] = useState([]);

    const { data: employ = [], refetch } = useQuery({
        queryKey: ['employee'],
        queryFn: async () => {
            const res = await fetch('http://localhost:5000/employee');
            const data = await res.json();
            setEmployees(data);
            return data;
        }
    })

    const handleSearch = (event) => {
        event.preventDefault();

        const form = event.target;
        const name = form.name.value;
        const phone = form.phone.value;
        const email = form.email.value;
        // const bDate = format(form?.bDate?.value, 'PP');
        let bDate = form.bDate?.value;

        // Check if bDate is a valid date and format it, otherwise set it to null
        if (bDate && !isNaN(new Date(bDate))) {
            bDate = format(new Date(bDate), 'PP');
        } else {
            bDate = null;  // Or handle it in a way that fits your business logic
        }

        const search = {
            name,
            email,
            phone,
            bDate
        }

        console.log(search)

        // Stringify the object and include it in the query parameter
        const queryString = Object.keys(search).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(search[key])}`).join('&');

        console.log(queryString)

        fetch(`http://localhost:5000/search-employee?${queryString}`)
            .then(res => res.json())
            .then(data => setEmployees(data));
    }

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = [...employees].reverse().slice(firstIndex, lastIndex);
    const nPage = Math.ceil(employees.length / recordsPerPage);
    const numbers = [...Array(nPage + 1).keys()].slice(1);

    const prevPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const changeCurrentPage = (id) => {
        setCurrentPage(id);
    }

    const nextPage = () => {
        if (currentPage !== nPage) {
            setCurrentPage(currentPage + 1);
        }
    }
    return (
        <div className=''>
            <div className="overflow-x-auto">
                <form onSubmit={handleSearch} className='grid grid-cols-5 gap-2 mt-3  p-2  justify-between outline-none focus:outline-none visited:outline-none'>
                    {/* <input type="text" className='w-2/3 px-3 outline-none' placeholder='Enter Property,Location,Landmark...' /> */}
                    <input type="text" name='name' placeholder="Full Name" className="input input-bordered w-full max-w-xs" />
                    <input type="date" name='bDate' placeholder="Date of Birth" className="input input-bordered w-full max-w-xs" />
                    <input type="email" name='email' placeholder="Email" className="input input-bordered w-full max-w-xs" />

                    <input type="text" name='phone' placeholder="Mobile" className="input input-bordered w-full max-w-xs" />

                    <button className='px-7 py-3 bg-purple-800 text-white rounded' >Search</button>
                </form>
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            {/* <th></th> */}
                            <th>Photo</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Date of Birth</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {
                            records.map(employee => <tr className="hover" key={employee._id}>
                                {/* <th></th> */}
                                <td>
                                    <img src={employee.image} alt='' className='h-16 w-16 rounded-lg' />
                                </td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.phone}</td>
                                <td>{employee.bDate}</td>
                                <td className='flex items-center justify-center gap-4'><label htmlFor='edit-modal' onClick={() => setSelectEmployee(employee)}><FaEdit className='text-3xl mt-3 cursor-pointer' /></label> <label htmlFor='delete-modal' onClick={() => setDeleteEmployee(employee)}><MdDelete className='text-3xl mt-3 cursor-pointer' /></label></td>
                            </tr>)
                        }
                        {/* row 2 */}


                    </tbody>
                    
                </table>
                <div className='flex items-center justify-between'>
                        <h2>Showing {firstIndex+1} to {lastIndex > employees.length ? employees.length : lastIndex} Out of {employees.length}</h2>
                        <div>
                            <div className="join mx-auto">
                                <button className="join-item btn hover:bg-purple-800 hover:text-white duration-500 transition-all" onClick={prevPage}>{'<'}</button>
                                {
                                    numbers.map((n, i) => (
                                        <button className={`join-item btn ${currentPage === n ? 'btn-active bg-purple-800 text-white' : ''}`} key={i} onClick={() => changeCurrentPage(n)}>{n}</button>
                                    ))
                                }
                                <button className="join-item btn hover:bg-purple-800 hover:text-white duration-500 transition-all" onClick={nextPage}>{'>'}</button>
                            </div>
                        </div>
                    </div>
            </div>
            {
                selectEmployee &&
                <EditModal emplyee={selectEmployee} setSelectEmployee={setSelectEmployee} refetch={refetch} />
            }
            {
                deleteEmployee &&
                <DeleteModal employee={deleteEmployee} setDeleteEmployee={setDeleteEmployee} refetch={refetch} />
            }
        </div>
    );
};

export default EmployeeShow;