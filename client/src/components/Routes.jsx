import React from 'react'

import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Admin from '../pages/Admin'
import Employee from '../pages/Employee'
import Trash from '../pages/Trash'
// import Maps from '../pages/Maps'

const AppRoutes = () => {
    return (
        <RouterRoutes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/employee' element={<Employee />} />
            <Route path='/trash' element={<Trash />} />
            {/* <Route path='/maps' element={<Maps />} /> */}
            <Route path='*' element={<Navigate to='/' replace />} />
        </RouterRoutes>
    )
}

export default AppRoutes
