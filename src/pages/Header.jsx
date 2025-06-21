import React, { useState, useEffect, useRef } from 'react';
import './Header.css'; 
import { FaBell } from 'react-icons/fa';
export default function Header () {
     return (
       <div>  
    <Head/>
       </div>
     )
   }
   const Head = () => {
     return (
       <div className="admin-header">
         <div className="search-box">
           <input type="text" placeholder="Search..." />
         </div>
   
         <div className="admin-info">
           <FaBell className="bell-icon" />
           <div className="user-info">
             <div className="user-avatar">👤</div>
             <span className="username">Admin User</span>
           </div>
         </div>
       </div>
     )
   }
   