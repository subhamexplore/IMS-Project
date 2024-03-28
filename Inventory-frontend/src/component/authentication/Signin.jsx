import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useUserAuth } from "./UserAuthContext";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import OtpInput from "react-otp-input";
import image3 from "../../assets/image3.png";
import { Bars } from "react-loader-spinner";

const Signin = ({ onLogin }) => {
  const [navClick, setNavClick] = useState(false);
  const [side, setSide] = useState(false);
  const navigation = useNavigate();
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [flag, setFlag] = useState(false);
  const [confirmObj, setConfirmObj] = useState("");
  const { setUpRecaptcha } = useUserAuth();

  const [open, setOpen] = React.useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);
  const handleEmailClose = () => setEmailOpen(false);
  const handleForgotClose = () => setForgotOpen(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgot, setForgot] = useState("");
  const handleClose = () => setOpen(false);

  const [passwordOpen, setPasswordOpen] = useState(false);
  const handlePasswordClose = () => setPasswordOpen(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [formdata, setFormData] = useState({
    username: "",
    password: "",
    isRemember: false,
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 400,
    bgcolor: "background.paper",
    border: "2px solid white",
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
  };

  const handleForgotCheck = async () => {
    await axios
      .post(`http://localhost:3500/forgot-password`, {
        forgotEmail: forgotEmail,
      })
      .then((res) => {
        if (res) {
          setIsLoading(false);
          setEmailOpen(true);
          setForgotOpen(false);
          setForgot(res.data);
        } else {
          isLoading(true);
        }
      })
      .catch((err) => setForgotError(err));
  };
  const resendOTP = () => {
    setMinutes(2);
    setSeconds(59);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    if (number === "" || number === undefined)
      return setError("Please Enter a valid Phone Number!");
    try {
      try {
        const response = await setUpRecaptcha(number);
        if (response) {
          setOpen(true);
        }
        setConfirmObj(response);
        setFlag(true);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const [display, setDisplay] = useState("block");
  const [btnDisable, setBtnDisable] = useState(true);

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (otp === "" || otp === null) return;
    try {
      setError("");
      await confirmObj.confirm(otp);
      setDisplay("none");
      setBtnDisable(false);
      setOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyEmailOtp = () => {
    if (emailOtp == forgot) {
      setPasswordOpen(true);
      setEmailOpen(false);
    } else {
      setVerifyEmail("red");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
      isRemember: e.target.checked,
    });
  };
  const [getData, setGetData] = useState([]);

  const getMpin = async () => {
    const result = await axios.get("http://localhost:3500");
    setGetData(result.data);
  };

  useEffect(() => {
    getMpin();
  }, []);

  const saveLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:3500", formdata);
      if (result.data !== "failure") {
        const tokenData = jwtDecode(result.data.accessToken);
        if (tokenData) {
          localStorage.setItem("cross", true);
        }
        const expirationTimestamp = tokenData.exp * 1000;
        if (formdata.isRemember === true) {
          const encryptedExpiryDate = CryptoJS.AES.encrypt(
            expirationTimestamp.toString(),
            "hey you cant decode my message"
          ).toString();
          localStorage.setItem("expiryDate", encryptedExpiryDate);
        }

        onLogin(true);

        getData ? navigation("/mpin") : navigation("/set-mpin");
      } else {
        setError("* Invalid username or password");
      }
    } catch (err) {
      console.log("Error while saving login:", err);
    }
  };

  const checkLogin = () => {
    const validDate = localStorage.getItem("expiryDate");
    if (validDate) {
      const decryptedBytes = CryptoJS.AES.decrypt(
        validDate,
        "hey you cant decode my message"
      );
      const decryptedExpiration = parseInt(
        decryptedBytes.toString(CryptoJS.enc.Utf8)
      );

      const dateObject = new Date(new Date(decryptedExpiration));
      const formattedDate = dateObject.toLocaleDateString("en-GB");
      const currentDate = new Date().toLocaleDateString("en-GB");

      const daysCount = formattedDate.split("/")[0] - currentDate.split("/")[0];

      if (daysCount <= 0) {
        localStorage.removeItem("expiryDate");
      } else {
        navigation("/mpin");
      }
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const [verifyEmail, setVerifyEmail] = useState("#D5D4D2");

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const [updatedPassword, setUpdatedPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePassword = async () => {
    if (updatedPassword === confirmPassword) {
      await axios
        .put(`http://localhost:3500/reset-password/${forgotEmail}`, {
          confirmPassword: confirmPassword,
        })
        .then(() => window.location.reload())
        .catch((err) => console.err(err));
    }
  };

  return (
    <div>
      {isLoading ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Bars
            height="80"
            width="80"
            color="#40a1ed"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div className="wrapper">
          <div className="page-body auth px-xl-4 px-sm-2 px-0 py-lg-2 py-1">
            <div className="container">
              <div className="row g-0">
                <div className="col-lg-7 d-none d-lg-flex justify-content-center align-items-center">
                  <div className="background">
                    <h1>WELCOME</h1>
                    <img src={image3} className="img" />
                    <span>Copyright © 2023 Orive Solutions.</span>
                  </div>

                  <div> </div>
                </div>
                <div className="col-lg-5 d-flex justify-content-center align-items-center">
                  <div
                    className="card shadow-sm w-100 p-6 p-md-4 card-sign"
                    style={{ margin: "0" }}
                  >
                    {/* Form */}
                    <form
                      className="row g-4 px-4"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div className="col-8 text-center ">
                        <h1 className="mt-4 heading">SIGN IN </h1>
                      </div>

                      <div className="col-12">
                        <div className="mb-2" style={{ textAlign: "left" }}>
                          <label className="form-label">Email address</label>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="name@example.com"
                            value={formdata.username}
                            name="username"
                            onChange={(e) => handleInputChange(e)}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-2">
                          <div className="form-label">
                            <span className="d-flex justify-content-between align-items-center">
                              {" "}
                              Password{" "}
                              <a
                                className=""
                                style={{ cursor: "pointer" }}
                                onClick={() => setForgotOpen(true)}
                              >
                                Forgot Password?
                              </a>
                            </span>
                          </div>
                          <input
                            id="password"
                            className="form-control form-control-lg"
                            type="password"
                            placeholder="Enter the password"
                            value={formdata.password}
                            name="password"
                            onChange={(e) => handleInputChange(e)}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-2">
                          {/* <div className="form-label">
                            <span className="d-flex justify-content-between align-items-center">
                              {" "}
                              Phone Number{" "}
                              <a
                                className="color"
                                onClick={handleSendCode}
                                style={{ cursor: "pointer", color: "#4a4e69" }}
                              >
                                Get OTP
                              </a>
                            </span>
                          </div>

                          <PhoneInput
                            id="phone"
                            style={{ display: "flex" }}
                            className="form-control form-control-lg"
                            type="tel"
                            maxLength={11}
                            defaultCountry="IN"
                            placeholder="Enter Your Phone Number"
                            name="phone"
                            value={number}
                            onChange={setNumber}
                          />
                          <div
                            id="recaptcha-container"
                            style={{ display: `${display}` }}
                          /> */}
                          {/* <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                              <div className="card-modal">
                                <h4>OTP</h4>

                                <div className="col-3 text-start card-cd">
                                  <span>Enter OTP</span>
                                </div>

                                <OtpInput
                                  value={otp}
                                  onChange={setOtp}
                                  numInputs={6}
                                  renderSeparator={
                                    <span style={{ width: "15px" }}></span>
                                  }
                                  renderInput={(props) => (
                                    <input className="inputWidth" {...props} />
                                  )}
                                  inputStyle={{
                                    border: "1px solid #D5D4D2",
                                    borderRadius: "8px",
                                    margin: "5px",
                                    width: "60px",
                                    height: "54px",
                                    fontSize: "12px",
                                    color: "#000",
                                    fontWeight: "400",
                                    caretColor: "blue",
                                  }}
                                />

                                <div
                                  className="col-12 text-center mt-1"
                                  onClick={verifyOtp}
                                >
                                  <a className="btn btn-lg btn-block btn-dark lift text-uppercase">
                                    Verify
                                  </a>
                                </div>
                              </div>
                            </Box>
                          </Modal> */}
                          <Modal
                            open={forgotOpen}
                            onClose={handleForgotClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                              <div className="card-modal">
                                <form className="row g-3">
                                  <div className="col-12 text-center mb-5">
                                    <img
                                      src="assets/img/auth-password-reset.svg"
                                      className="w240 mb-4"
                                      alt=""
                                    />
                                    <h1>Forgot password?</h1>
                                    <span>
                                      Enter the email address associated with
                                      this user credentials.
                                    </span>
                                  </div>
                                  <div className="col-12">
                                    <div className="mb-2">
                                      <label className="form-label">
                                        Email address
                                      </label>
                                      <input
                                        type="email"
                                        error={forgotError}
                                        className="form-control form-control-lg"
                                        placeholder="name@example.com"
                                        value={forgotEmail}
                                        onChange={(e) =>
                                          setForgotEmail(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 text-center mt-4">
                                    <a
                                      onClick={handleForgotCheck}
                                      className="btn btn-lg btn-block btn-dark lift text-uppercase"
                                    >
                                      SUBMIT
                                    </a>
                                  </div>
                                  <div className="col-12 text-center mt-4">
                                    <span
                                      className="text-muted"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <a
                                        onClick={() => {
                                          handleForgotClose();
                                          navigation("/");
                                        }}
                                      >
                                        Back to Sign in
                                      </a>
                                    </span>
                                  </div>
                                </form>
                              </div>
                            </Box>
                          </Modal>
                          <Modal
                            id="email-otp-verify"
                            open={emailOpen}
                            onClose={handleEmailClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                              <div className="card-modal">
                                <h4>OTP</h4>

                                <div className="col-3 text-start card-cd">
                                  <span>Enter OTP</span>
                                </div>

                                <OtpInput
                                  value={emailOtp}
                                  onChange={setEmailOtp}
                                  numInputs={6}
                                  error={"cfwjiw"}
                                  renderSeparator={
                                    <span style={{ width: "15px" }}></span>
                                  }
                                  renderInput={(props) => (
                                    <input className="inputWidth" {...props} />
                                  )}
                                  inputStyle={{
                                    border: `1px solid ${verifyEmail}`,
                                    borderRadius: "8px",
                                    margin: "5px",
                                    width: "60px",
                                    height: "54px",
                                    fontSize: "12px",
                                    color: "#000",
                                    fontWeight: "400",
                                    caretColor: "blue",
                                  }}
                                />

                                <div
                                  className="col-12 text-center mt-1"
                                  onClick={verifyEmailOtp}
                                >
                                  <a className="btn btn-lg btn-block btn-dark lift text-uppercase">
                                    Verify
                                  </a>
                                </div>
                              </div>
                            </Box>
                          </Modal>
                          <Modal
                            open={passwordOpen}
                            onClose={handlePasswordClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                              <div className="card-modal">
                                <form className="row g-3">
                                  <div className="col-12 text-center mb-5">
                                    <img
                                      src="assets/img/auth-password-reset.svg"
                                      className="w240 mb-4"
                                      alt=""
                                    />
                                    <h1>Reset password!!</h1>
                                  </div>
                                  <div className="col-12">
                                    <div className="mb-2">
                                      <label className="form-label">
                                        New Password
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        value={updatedPassword}
                                        onChange={(e) =>
                                          setUpdatedPassword(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="mb-2">
                                      <label className="form-label">
                                        Confirm Password
                                      </label>
                                      <input
                                        type="password"
                                        error={
                                          updatedPassword === confirmPassword
                                            ? ""
                                            : "Password Mismatch"
                                        }
                                        className="form-control form-control-lg"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                          setConfirmPassword(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 text-center mt-4">
                                    <a
                                      onClick={handlePassword}
                                      className="btn btn-lg btn-block btn-dark lift text-uppercase"
                                    >
                                      SUBMIT
                                    </a>
                                  </div>
                                  <div className="col-12 text-center mt-4">
                                    <span
                                      className="text-muted"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <a
                                        onClick={() => {
                                          handlePasswordClose();
                                          navigation("/");
                                        }}
                                      >
                                        Back to Sign in
                                      </a>
                                    </span>
                                  </div>
                                </form>
                              </div>
                            </Box>
                          </Modal>
                        </div>
                      </div>

                      <div className="col-12">
                        <div
                          className="form-check"
                          style={{ textAlign: "left" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            defaultValue=""
                            id="flexCheckDefault"
                            onChange={(e) => handleInputChange(e)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            {" "}
                            Remember me{" "}
                          </label>
                        </div>
                      </div>
                      <div style={{ color: "red" }}>{error}</div>
                      <button
                        className="col-12 text-center mt-4 btn btn-lg btn-block btn-dark lift text-uppercase"
                        onClick={(e) => saveLogin(e)}
                        // disabled={btnDisable}
                      >
                        Sign In
                      </button>
                    </form>
                    {/* End Form */}
                  </div>
                </div>
              </div>{" "}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signin;
