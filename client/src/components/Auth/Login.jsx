import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../public/styles/login.css';
import Logo from "../../../public/assets/logo.png";
import NavigationBar from '../NavigationBar';
import PropTypes from "prop-types";
import axios from "axios";
import { useState,useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

function Login(props) {
  const {person,setAuth}=props;
  const [email,setEmail]=useState(null);
  const [password,setPassword]=useState(null);
  const [isBtnDisabled,setIsBtnDisabled]=useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    if(email && password){
      setIsBtnDisabled(false);
    }
    else{
      setIsBtnDisabled(true);
    }
  },[email,password]);

  const handleSubmit=async(event)=>{
    event.preventDefault();
    let isValid = true;

    // Email Validation : 
    let re2 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!re2.test(email)) {
            document.getElementById('emailMsg').innerText ='Enter a proper email.';
            isValid = false;
        } else {
            document.getElementById('emailMsg').innerText = ''
        }

    // Password Validation: 
    let re3 = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
         if (!re3.test(password)) {
             document.getElementById('passwordMsg').innerText ='Enter a proper password of minimum 8 characters having at least one lowercase character, one uppercase character and a digit.';
             isValid = false
         } else {
             document.getElementById('passwordMsg').innerText = ''
         }
         if (!isValid) {
          return // If validation fails, do not proceed
      }
      try {
        const data = {email,password,person}
        await axios
        .post(`http://localhost:3001/login`,data)
        .then((response)=>{
          toast(response.data.text);
          if (response.data.text==="User Validated") {

            const token = response.data.Token;
            const registrationId = response.data.registrationId;

            localStorage.setItem('registrationId', registrationId);
            localStorage.setItem('person',person);
            localStorage.setItem('authToken',token);

            setAuth({ Token: token })
            navigate(`/${person}Homepage/Profile`);
            
          }
        })
      } catch (error) {
        console.log(error);
      }
    
  }
  return (
    <>
    <NavigationBar/>
    <Container fluid className="d-flex align-items-center" style={{ height: '100vh' }}>
      <main className="form-signin w-100 m-auto bg-white shadow rounded">
        <Form onSubmit={handleSubmit}>
          <div className="d-flex gap-2 justify-content-center mb-4">
            <img className="border border-2 border-black" src={Logo} alt="Logo" width="60" />
            <div>
              <h1 className="h3 fw-normal my-1"><b>DreamJobs</b></h1>
              <p className="m-0"><i><u>{props.person} Login Page</u></i></p>
            </div>
          </div>

          <Form.Floating className="mb-2">
            <Form.Control type="email" id="floatingEmail" placeholder="name@example.com" onChange={(event)=>setEmail(event.target.value)}/>
            <label htmlFor="floatingEmail"><i className="bi bi-envelope"></i> Email address</label>
          </Form.Floating>
          <p className=" text-danger fw-bold m-1" id="emailMsg"></p>
          <Form.Floating className="mb-3">
            <Form.Control type="password" id="floatingPassword" placeholder="Password" onChange={(event)=>setPassword(event.target.value)} />
            <label htmlFor="floatingPassword"><i className="bi bi-key"></i> Password</label>
          </Form.Floating>
          <p className=" text-danger fw-bold m-1" id="passwordMsg"></p>

          <Button variant="primary" type="submit" className="w-100 py-2 mb-3" disabled={isBtnDisabled}>
            Login <i className="bi bi-box-arrow-in-right"></i>
          </Button>

          <div className="d-flex justify-content-between">
            <Link to={`/${props.person}ForgotPassword`} className="text-decoration-none">Forgot Password?</Link>
            <Link to={`/${props.person}Register`} className="text-decoration-none">Register</Link>
          </div>
        </Form>
      </main>
    </Container></>
    
  );
}
Login.propTypes = {
  person: PropTypes.string.isRequired,
  setAuth: PropTypes.func.isRequired,
};

export default Login;
