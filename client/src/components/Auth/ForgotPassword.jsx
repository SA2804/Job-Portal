import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../public/assets/logo.png";
import NavigationBar from "../NavigationBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

function ForgotPassword(props) {

    const [email,setEmail]=useState(null);
    const [isButtonDisabled,setIsButtonDisabled]=useState(true);
    const navigate = useNavigate();
    const person = props.person;

    useEffect(()=>{
        if (email) {
            setIsButtonDisabled(false);
        }
        else{
            setIsButtonDisabled(true);
        }
    },[email])

    const handleSubmit =async(event)=>{

        event.preventDefault();
        let isValid = true;

        // Email Validation:
        let re2 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!re2.test(email)) {
            document.getElementById('emailMsg').innerText ='Enter a proper email.';
            isValid = false;
        } else {
            document.getElementById('emailMsg').innerText = ''
        }
        if (!isValid) {
            return // If validation fails, do not proceed
        }
        try {
            const data = {email,person};
            await axios
            .post('http://localhost:3001/forgotPassword',data)
            .then(async (response) => {
                const text = response.data['text'];
                const otp = response.data['otp'];
                toast(text);
                if (otp !== null){
                    navigate(`/${person}VerifyOTP`, {
                        state: { mailOTP: otp, Mail: email },
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <>
    <NavigationBar/>
    <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="w-100" style={{ maxWidth: '500px' }}>
                    <main className="form-signin w-100 m-auto bg-white shadow rounded p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="d-flex gap-2 justify-content-center mb-4">
                                <img
                                    className="border border-2 border-black"
                                    src={Logo}
                                    alt="Resume"
                                    width="60"
                                />
                                <div>
                                    <h1 className="h3 fw-bold my-1">
                                        DreamJobs
                                    </h1>
                                    <p className="m-0">
                                        <i>Forgot your password</i>
                                    </p>
                                </div>
                            </div>

                            <div className="form-floating mb-4">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="floatingEmail"
                                    placeholder="name@example.com"
                                    onChange={(event)=>setEmail(event.target.value)}
                                    
                                />
                                <label htmlFor="floatingEmail">
                                    <i className="bi bi-envelope"></i> Enter
                                    your Gmail
                                </label>
                                <p
                                    className=" text-danger fw-bold m-1"
                                    id="emailMsg"
                                ></p>
                            </div>

                            <button
                                className="btn btn-primary w-100 py-2"
                                type="submit"
                                disabled={isButtonDisabled}
                            >
                                <i className="bi bi-send"></i> Send Verification
                                Code
                            </button>

                            <div className="d-flex justify-content-between my-3">
                                <Link to={`/${person}Register`} className="text-decoration-none">
                                    Register
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
ForgotPassword.propTypes = {
    person: PropTypes.string.isRequired
  };
export default ForgotPassword