import axios from 'axios';
import { useState } from 'react';
import Logo from "../../../public/assets/logo.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from "prop-types";

function ChangePassword(props) {

    const person = props.person;
    const [newPassword, setNewPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {}

    const handleSubmit = (event) => {
        event.preventDefault()
        let isValid = true
        // Password Validation:
        let re3 = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
        if (newPassword === null) {
            document.getElementById('newMsg').innerText = 'Enter your password.'
            isValid = false
        } else if (!re3.test(newPassword)) {
            document.getElementById('newMsg').innerText =
                'Enter a proper password of minimum 8 characters having at least one lowercase character, one uppercase character and a digit.'
            isValid = false
        } else {
            document.getElementById('newMsg').innerText = ''
        }
        // Confirm Password Validation:
        if (confirmPassword === null) {
            document.getElementById('confirmMsg').innerText =
                'Confirm your new password by entering it again.'
            isValid = false
        } else if (confirmPassword !== newPassword) {
            document.getElementById('confirmMsg').innerText =
                'New password and confirmation password do not match.'
            isValid = false
        } else {
            document.getElementById('confirmMsg').innerText = ''
        }
        if (!isValid) {
            return // If validation fails, do not proceed
        }
        try {
            axios
                .post('http://localhost:3001/changePassword', {
                    newPassword: newPassword,
                    Email: email,
                    Person:person
                })
                .then((response) => {
                    toast(response.data)
                    navigate(`/${person}Login`)
                })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
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
                                        Dream Jobs
                                    </h1>
                                    <p className="m-0">
                                        <i>Change password: </i>
                                    </p>
                                </div>
                            </div>

                            <div className="form-floating mb-2">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="floatingOTP"
                                    placeholder="Default"
                                    onChange={(event) =>
                                        setNewPassword(event.target.value)
                                    }
                                />
                                <label htmlFor="floatingEmail">
                                    <i className="bi bi-lock"></i> Enter New
                                    Password
                                </label>
                                <p
                                    className=" text-danger fw-bold m-1"
                                    id="newMsg"
                                ></p>
                            </div>
                            <div className="form-floating mb-4">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="floatingOTP"
                                    placeholder="Default"
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                />
                                <label htmlFor="floatingEmail">
                                    <i className="bi bi-lock"></i> Confirm
                                    Password
                                </label>
                                <p
                                    className=" text-danger fw-bold m-1"
                                    id="confirmMsg"
                                ></p>
                            </div>

                            <button
                                className="btn btn-primary w-100 py-2"
                                type="submit"
                            >
                                <i className="bi bi-send"></i> Confirm
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
ChangePassword.propTypes = {
    person: PropTypes.string.isRequired
  };
export default ChangePassword
