/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import './MasterAdminPage.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MasterAdminPage(){
    const Navigate = useNavigate()
    const [Verified, setVerified] = useState(true)

    useEffect(() => {
        const checkRole = async() => {
            const role = await localStorage.getItem('admin-role')
            console.log(role)
            if(role!=="masterAdmin") Navigate('/admin-login')
        }
        checkRole()
    }, [])
    

    return <>
        <h1>Master Admin Dashboard</h1>
    </>
}