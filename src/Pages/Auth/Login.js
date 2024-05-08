import React, { useState } from 'react';
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
 const [details, setDetails] = useState({
    email: "",
    password: ""
 })
 const onChange = (e) => {
    setError(false);
    setDetails({
        ...details,
        [e.target.name]: e.target.value
    })
 }
 const [loader, setLoader] = useState(false);
 const [error, setError] = useState(false);
 const history = useNavigate();
 const login = async() => {
    try {
      setError(false);
        setLoader(true);
        const res = await axios.post('/api/v1/login', details);
        if (res.data.success) {
          if(res.data.user.isMedical) {
            history('/dashboard');
          }else{
            history('/');  
          }
          setLoader(false);
        }
    } catch (error) {
        setLoader(false);
        console.log(error);
        setError(true);
    }  finally {
        setLoader(false);
    }
 }
  return (
    <MDBContainer fluid className="p-3 my-5 h-full">

      <MDBRow>

        <MDBCol col='10' md='6'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" class="img-fluid" alt="Sample image" />
        </MDBCol>
        
        <MDBCol col='4' md='6' className='mt-5'>
          <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" onChange={onChange} name="email" value={details.email}/>
          <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" onChange={onChange} name="password" value={details.password}/>
          {error && <p className="text-danger">Invalid email or password!</p>}

          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>

          <div className='text-center text-md-start mt-4 pt-2'>
            <MDBBtn className="mb-0 px-5" size='lg' onClick={login}>Login</MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <a href="/signup" className="link-danger">Register</a></p>
          </div>

        </MDBCol>

      </MDBRow>
    </MDBContainer>
  );
}

export default Login;