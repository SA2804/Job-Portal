import { useEffect, useState } from "react";
import Logo from "../../../public/assets/logo.png";
import { Link } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import axios from "axios";
import { toast } from 'react-toastify';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Register(props) {

    const [name,setName]=useState(null);
    const [email,setEmail]=useState(null);
    const [password,setPassword]=useState(null);
    const [isButtonDisabled,setIsButtonDisabled]=useState(true);
    const person = props.person;
    const navigate = useNavigate();

    useEffect(()=>{
        if (name && email && password) {
            setIsButtonDisabled(false);
        }
        else{
            setIsButtonDisabled(true)
        }
    },[name,email,password])
    
    const handleSubmit=async(event)=>{
        event.preventDefault();
        let isValid = true;
        // Name Validation:
        let re1 = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/
        if (!re1.test(name)) {
            document.getElementById('nameMsg').innerText ='Enter a proper name.';
            isValid = false;
        } else {
            document.getElementById('nameMsg').innerText = ''
        }
        // Email Validation: 
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
            const data = {name,email,password,person};
            await axios
            .post('http://localhost:3001/registration',data)
            .then((response)=>{
                toast(response.data.text);
                if (response.data.text === 'Registration Success') {
                    const registrationId = response.data.regID;
                    localStorage.setItem('registrationId', registrationId);
                    navigate(`/${person}Login`);
                }
            })
         } catch (error) {
            console.log(error);
         }
    }
  return (
    <>
    <NavigationBar/>
          <div className="d-flex vh-100 align-items-center">
                <div className="w-100">
                    <main className="form-signin w-100 m-auto bg-white shadow rounded">
                        <form onSubmit={handleSubmit}>
                            <div className="d-flex gap-2 justify-content-center ">
                                <img
                                    className="border border2 border-black mb-4"
                                    src={Logo}
                                    alt="logo"
                                    width="60"
                                />
                                <div>
                                    <h1 className="h3 fw-normal my-1">
                                        <b>DreamJobs</b>
                                    </h1>
                                    <p className="m-0">
                                        <i> {person} Registration Page</i>
                                    </p>
                                </div>
                            </div>

                            <div className="form-floating mb-2">
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    id="floatingName"
                                    placeholder=""
                                    onChange={(event)=>setName(event.target.value)}
                                />
                                <label htmlFor="floatingInput">
                                    <i className="bi bi-person"> Full Name</i>
                                </label>
                                <p
                                    className=" text-danger fw-bold m-1"
                                    id="nameMsg"
                                ></p>
                            </div>
                            <div className="form-floating mb-2">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    id="floatingEmail"
                                    placeholder=""
                                    onChange={(event)=>setEmail(event.target.value)}
                                />
                                <label htmlFor="floatingInput">
                                    <i className="bi bi-envelope">
                                        {' '}
                                        Email address
                                    </i>
                                </label>
                                <p
                                    className=" text-danger fw-bold m-1"
                                    id="emailMsg"
                                ></p>
                            </div>
                            <div className="form-floating">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    id="floatingPassword"
                                    placeholder="Password"
                                    onChange={(event)=>setPassword(event.target.value)}
                                />
                                <label htmlFor="floatingPassword">
                                    <i className="bi bi-key"> Password</i>
                                </label>
                                <p
                                    className=" text-danger fw-bold m-1"
                                    id="passwordMsg"
                                ></p>
                            </div>
                            <button
                                className="btn btn-primary w-100 py-2"
                                type="submit"
                                disabled={isButtonDisabled}
                                id="registerBtn"
                            >
                                <i className="bi bi-person-plus-fill">
                                    {' '}
                                    Register
                                </i>
                            </button>
                            <div className="d-flex justify-content-between my-3">
                                <Link
                                    to={`/${person}ForgotPassword`}
                                    className="text-decoration-none"
                                >
                                    Forgot Password ?
                                </Link>
                                <Link
                                    to={`/${person}Login`}
                                    className="text-decoration-none"
                                >
                                    Login
                                </Link>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
    </>
  )
}
Register.propTypes = {
    person: PropTypes.string.isRequired
  };

export default Register