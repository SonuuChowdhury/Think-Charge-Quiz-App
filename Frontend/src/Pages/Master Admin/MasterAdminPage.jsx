/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import './MasterAdminPage.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MasterAdminPage() {
    const navigate = useNavigate();
    const [participantDetails, setParticipantDetails] = useState([]);
    const [verified, setVerified] = useState(true);

    useEffect(() => {
        const checkRole = () => {
            const role = localStorage.getItem('admin-role');
            console.log("Admin Role:", role); 
            if (role !== "masterAdmin") {
                navigate('/admin-login');
            }
        };
        checkRole();
    }, [navigate]); 


    useEffect(() => {
        const FetchTeamDetails = async () => {
            try {
                const token = localStorage.getItem("admin-token");
                console.log("Admin Token:", token); // ✅ Debug log

                if (!token) {
                    console.error("No admin token found!");
                    return;
                }

                const response = await axios.post(
                    "https://think-charge-quiz-app.onrender.com/fetch-attendance",
                    {}, // Empty request body
                    {
                        headers: {
                            "scee-event-admin-token": token,
                        },
                    }
                );

                console.log("Response Data:", response.data); // ✅ Debug log
                setParticipantDetails(response.data); // ✅ Update state
            } catch (error) {
                console.error("Error fetching team details:", error);
            }
        };

        FetchTeamDetails();
    }, []);

    return (
        <>
            <nav className="MasterAdminNav">
                <span className="MasterAdminNavHeader">Master Admin</span>
                <button className="MasterAdminNavLogOutButton">LOG OUT</button>
            </nav>

        </>
    );
}
