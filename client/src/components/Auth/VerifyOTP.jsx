import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from "../../../public/assets/logo.png";
import NavigationBar from "../NavigationBar";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from "prop-types";

function Verify(props) {

    const person = props.person;
    const [userOTP, setUserOTP] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    let { mailOTP } = location.state || {}
    const { Mail } = location.state || {}

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            await axios
                .post('http://localhost:3001/verifyOTP', {
                    mailGeneratedOTP: mailOTP,
                    email: Mail,
                    userGeneratedOTP: userOTP,
                })
                .then((res) => {
                    if (res.data['text']) {
                        toast(res.data['text'])
                        navigate(`/${person}ForgotPassword`)
                    } else {
                        toast(res.data)
                    }
                    if (res.data == 'Successful OTP Validation.') {
                        navigate(`/${person}ChangePassword`, { state: { email: Mail } })
                    }
                })
        } catch (error) {
            console.log(error)
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
                                        Dream Jobs
                                    </h1>
                                    <p className="m-0">
                                        <i>Enter 6 digit verification Code</i>
                                    </p>
                                </div>
                            </div>

                            <div className="form-floating mb-4">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="floatingOTP"
                                    placeholder="Enter OTP"
                                    onChange={(event) =>
                                        setUserOTP(event.target.value)
                                    }
                                />
                                <label htmlFor="floatingEmail">
                                    <i className="bi bi-key"></i> Enter OTP
                                </label>
                            </div>

                            <button
                                className="btn btn-primary w-100 py-2"
                                type="submit"
                            >
                                <i className="bi bi-send"></i> Verify
                            </button>

                            <div className="d-flex justify-content-between my-3">
                                <Link to={`/${person}Register`}className="text-decoration-none">
                                    Register
                                </Link>
                                <Link
                                    to={`/${person}Register`}
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
Verify.propTypes = {
    person: PropTypes.string.isRequired
  };
export default Verify
