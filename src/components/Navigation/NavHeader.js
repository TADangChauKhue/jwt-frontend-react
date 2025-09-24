import React, { useEffect, useState,useContext} from 'react';
import './Nav.scss';
import { Link,NavLink, useLocation,useHistory } from 'react-router-dom';
import {UserContext,logoutContext} from "../../context/UserContext";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import logo from "../../logo.png"
import {logoutUser} from '../../services/userServices'
import {toast} from'react-toastify';

const NavHeader=(props)=> {
    const {user,logoutContext} = useContext(UserContext);
    const location =useLocation();
    const history =useHistory()
    const handleLogout =async()=>{
        let data= await logoutUser();
        localStorage.removeItem("jwt")
        logoutContext()
        if(data && +data.EC === 0){
            toast.success('Log out succeeds')
            history.push('/login')
        }else{
            toast.error(data.EM)
        }
    }
    if (user && user.isAuthenticated===true || location.pathname ==='/'){ 
    return (
        <>
                {/* <div className="topnav">
                <NavLink to="/" exact>Home</NavLink>
                <NavLink to="/users">Users</NavLink>
                <NavLink to="/projects">Projects</NavLink>
                <NavLink to="/about">About</NavLink>
                </div>    */}
                <div className='nav-header'>
                    <Navbar bg="header" expand="lg">
                        <Container>
                            <Navbar.Brand href="#home">
                                <img
                                        src={logo}
                                        width="40"
                                        height="30"
                                        className="d-inline-block align-top"
                                        // alt="React Bootstrap logo"
                                        />
                                <span className ="brandname ms-2"></span>VCSI Learning

                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                <NavLink to="/" exact className="nav-link">Home</NavLink>
                                <NavLink to="/users" className="nav-link">Users</NavLink>
                                <NavLink to="/projects" className="nav-link">Projects</NavLink>
                                <NavLink to="/about" className="nav-link">About</NavLink>
                                </Nav>
                                <Nav>
                                    {user && user.isAuthenticated===true
                                        ?
                                        <>
                                        <Nav.Item className="nav-link">
                                            Welcome {user.account.username} !
                                        </Nav.Item>
                                         <NavDropdown title="Settings" id="basic-nav-dropdown">
                                            <NavDropdown.Item>Change Password</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item>
                                                <span onClick={()=>{handleLogout()}}>Log out</span>
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                        </>
                                        :
                                        <Link className="nav-link" to='/login'>
                                            Login
                                        </Link>

                                    }


                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>
        </>       

    );}
    else {
        return <></>
    }
}

export default NavHeader;