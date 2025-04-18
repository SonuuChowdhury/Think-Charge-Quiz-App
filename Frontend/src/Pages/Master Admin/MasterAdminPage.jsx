/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./MasterAdminPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../Components/Loader/Loader.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faListUl,faUserGroup,faCircleInfo, faTrash, faEye} from '@fortawesome/free-solid-svg-icons';

export default function MasterAdminPage() {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false)
  const [deletingTeamDetails, setDeletingTeamDetails] = useState({})
  const [deletingTeam, setDeletingTeam] = useState(false)
  const [viewingTeamDetails, setViewingTeamDetails] = useState({})
  const [viewingTeam, setViewingTeam] = useState(false)

  const [participantDetails, setParticipantDetails] = useState([]);

  useEffect(() => {
    const checkRole = () => {
      const role = localStorage.getItem("admin-role");
      if (role !== "masterAdmin") {
        navigate("/admin-login");
      }
    };
    checkRole();
  }, [navigate]);

  useEffect(() => {
    const FetchTeamDetails = async () => {
      try {
        setisLoading(true)
        const token = localStorage.getItem("admin-token");

        if (!token) {
          console.error("No admin token found!");
          return;
        }

        const response = await axios.get(
          "https://think-charge-quiz-app.onrender.com/fetch-teams",
          {
            headers: {
              "scee-event-admin-token": token,
            },
          }
        );

        if(response.status==200){
            setParticipantDetails(response.data.data); 
        }else{
            alert("Failed to fetch teams")
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
      }finally{
        setisLoading(false)
      }
    };

    FetchTeamDetails();
  }, []);


  function formatDate(dateString) {
    const dt = new Date(dateString);
    
    // Adjust for Indian Standard Time (IST) which is UTC+5:30
    const utc = dt.getTime() + (dt.getTimezoneOffset() * 60000);
    const ISTTime = new Date(utc);

    const hours = ISTTime.getHours();
    const minutes = ISTTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    const month = (ISTTime.getMonth() + 1).toString().padStart(2, '0');
    const day = ISTTime.getDate().toString().padStart(2, '0');
    const year = ISTTime.getFullYear().toString().slice(2);

    const formattedDate = `${hours12}:${minutes} ${ampm}, ${day}/${month}/${year}`;
    return formattedDate;
}


const DeleteTeamHandeller = async()=>{
  setisLoading(true)
  try{
    const token = localStorage.getItem("admin-token");
    if (!token) {
      console.error("No admin token found!");
      return;
    }
    const response = await axios.delete(
      `https://think-charge-quiz-app.onrender.com/delete-participants/${deletingTeamDetails.mobile}`,
      {
        headers: {
          "scee-event-admin-token": token,
        },
      }
    );
    if(response.status==200){
      alert(`Deleted team ${deletingTeamDetails.teamName} `)
    }
  }catch(err){
    alert("Failed to delete the team")
    console.log(err)
  }finally{
    setisLoading(false)
    window.location.reload()
  }
}



const DeleteActionHandeller = ()=>{
  return ( <div className="DeleteActionHandellerBackground" onClick={()=>{setDeletingTeam(false)}}>
              <div className="DeleteActionHandellerBox" onClick={(e)=>{
                e.stopPropagation()
                }}>
                <span className="DeleteActionHandellerBoxConfirmText">Confirm Delete Team</span>
                <span className="DeleteActionHandellerBoxConfirmTeamName">
                {deletingTeamDetails.teamName}
                </span>
                <span className="DeleteActionHandellerBoxConfirmTeamName">
                {deletingTeamDetails.mobile}
                </span>
                <div className="DeleteActionHandellerBoxConfirmButtonSection">
                  <button onClick={()=>setDeletingTeam(false)} >No</button>
                  <button onClick={DeleteTeamHandeller}>Yes</button>
                </div>
              </div>
  </div> )
}


const ViewActionHandeller = () => {

  return (
    <div
      className="ViewActionHandellerBackground"
      onClick={() => setViewingTeam(false)}
    >
      <div
        className="ViewActionHandellerBox"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="team-title">{viewingTeamDetails.teamName}</h2>
        <div className="members-list">
          {viewingTeamDetails.members.map(member => (
            <div className="member-card" key={member._id}>
              <div className="member-header">
                <span className="member-name">{member.name}</span>
                <span className={`member-role ${member.role.toLowerCase()}`}>
                  {member.role}
                </span>
              </div>
              <div className="member-details">
                <span>{member.department}</span>
                <span>Sem: {member.sem}</span>
                <span>{member.gender}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
  return (
    <>
      {isLoading && <Loader />}
      {viewingTeam && <ViewActionHandeller/>}
      {deletingTeam && <DeleteActionHandeller/> }
      <nav className="master-admin-nav">
        <div className="nav-brand">
          <h1>Master Dashboard</h1>
          <small>Admin Portal</small>
        </div>
        <button
          className="logout-button"
          onClick={() => navigate("/admin-login")}
        >
          Log Out
        </button>
      </nav>

        <div className="MasterAdminCOntrolButtonSection">
            <span className="MasterAddTeamButtonPrimary">
                <button className="MasterAddTeamButton">
                    Add Teams <FontAwesomeIcon icon={faUserGroup} />
                </button>
                <FontAwesomeIcon title="Upload the team details in the desired format to read and upload and the team details to server" className="MasterAdminCOntrolButtonSectionInfoButton" icon={faCircleInfo} />
            </span>
            <span className="MasterMoreControlsBurgerIconSection">
                <FontAwesomeIcon icon={faListUl} />
            </span>
        </div>

        <div className="MasterTeamListSectionArea">
            <span className="MasterTeamListSectionAreaHeader">
                Teams
            </span>



            <div className="MasterTeamListSection">
    {participantDetails.map((data, index) => (
        <div className="MasterTeamListSectionItem" key={index}>
            <div className="MasterTeamListSectionItemMataDetailsSection">
                <span className="MasterTeamListSectionItemTeamName">{data.teamName}</span>
                <span>
                    {data.mobile}
                </span>
                <span>
                    {data.email ? data.email : "No Email"}
                </span>
            </div>

            <div className="MasterTeamListSectionItemLoginDetailsAndControlSection">
                <span className="MasterTeamListSectionItemLoginDetailsAndControlSectionDates">
                    <span>Joined: </span>
                    <span className="MasterTeamListSectionItemLoginDetailsAndControlSectionDates">{formatDate(data.joined) || "No Data"}</span>
                    <span>Last LogIn: </span>
                    <span className="MasterTeamListSectionItemLoginDetailsAndControlSectionDates">{formatDate(data.LastLogin) || "No Data"}</span>
                </span>
                <div className="MasterTeamListSectionItemLoginDetailsAndControlSectionButtonSection">
                    <button className="viewButton" onClick={()=>{
                      setViewingTeamDetails({
                        "teamName":data.teamName,
                        "members":data.teamMembers
                      })
                      setViewingTeam(true)
                    }}>
                        <FontAwesomeIcon icon={faEye} />
                        View
                    </button>
                    <button className="deleteButton" onClick={()=>{
                      setDeletingTeamDetails({
                        "teamName":data.teamName,
                        "mobile":data.mobile
                      })
                      setDeletingTeam(true)
                      }}>
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    ))}
</div>
        </div>

    </>
  );
}
