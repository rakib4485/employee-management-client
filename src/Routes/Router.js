import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Main from '../Layout/Main';
import EmployeeShow from '../pages/EmployeeShow/EmployeeShow';
import AddEmployee from '../pages/AddEmployee/AddEmployee';


 const router = createBrowserRouter([
    {
        path: '/',
        element: <Main/>,
        children: [
            {
                path: '/',
                element: <EmployeeShow/>
            },
            {
                path: '/add-employee',
                element: <AddEmployee/>
            }
        ]
    }
 ])

export default router;