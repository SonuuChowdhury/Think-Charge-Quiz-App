/* eslint-disable react-hooks/exhaustive-deps */
import './AttendnaceAdmin.css'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function AttendanceAdminPage(){
    const Navigate = useNavigate()

    useEffect(() => {
            const checkRole = async() => {
                const role = await localStorage.getItem('admin-role')
                console.log(role)
                if(role!=="masterAdmin") Navigate('/admin-login')
            }
            checkRole()
    }, [])


    return <>
        <h1>Attendance Admin Dashboard</h1>
    </>
}