import React, { useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBTextArea,
    MDBModal,
    MDBModalBody,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle
}
    from 'mdb-react-ui-kit';
import { ArrowBack } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [isMedical, setIsMedical] = useState(false);
    const [centredModal, setCentredModal] = useState(true);
    const [Screen, setScreen] = useState(0);
    const [Loader, setLoader] = useState({
        visible: false,
        text: 'Loading...',
        desc: 'Please wait while we are creating your account'
    })
    const toggleOpen = () => setCentredModal(!centredModal);
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        phone: '',
        ShopName: ''
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    }
    let history = useNavigate()
    const next = (medical) => {
        if (medical) {
            setIsMedical(true);
            setScreen(1)
        }
        else {
            setIsMedical(false);
            setScreen(1)
        }
    }
    const [location, setLocation] = useState(null);

    const getLocation = () => {
        try {
            setLoader({ ...Loader, visible: true, text: 'Fetching Location', desc: 'Please wait while we are fetching your location' });
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ latitude, longitude });
                        setLoader({ ...Loader, visible: false });
                    },
                    error => {
                        console.error('Error getting location:', error);
                        setLoader({ ...Loader, visible: false });
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                setLoader({ ...Loader, visible: false });
            }

        } catch (error) {

        } finally {
        }
    }

    const createAccount = async()=>{
        setLoader({ ...Loader, visible: true, text: 'Creating Account', desc: 'Please wait while we are creating your account' });
        try {
            const res = await axios.post('/api/v1/register', {
                name: data.name, email: data.email, password: data.password, ShopName: data.ShopName, isMedical: isMedical, latitude: location.latitude, longitude: location.longitude 
            })
            if(res.data.success){
                history('/');
            }
        } catch (error) {
            
        }finally{
            setLoader({ ...Loader, visible: false });
        }
    }
    return (
        <>
            {
                Screen == 0 ?
                    <>
                        <MDBModal staticBackdrop tabIndex='-1' open={centredModal} onClose={() => setCentredModal(false)}>
                            <MDBModalDialog centered>
                                <MDBModalContent>
                                    <MDBModalHeader>
                                        <MDBModalTitle>Signup As</MDBModalTitle>
                                    </MDBModalHeader>
                                    <MDBModalBody>
                                        <p>
                                            If you run a medical shop and wanna sell your medicines, proceed and sign up as a medical shop.
                                        </p>
                                        <div className='w-full flex justify-around items-center'>
                                            <MDBBtn color='secondary' onClick={() => { next(true) }}>
                                                Signup As Medical Shop
                                            </MDBBtn>
                                            <MDBBtn className='mx-1' onClick={() => { next(false) }}>Continue with customer profile</MDBBtn>
                                        </div>
                                    </MDBModalBody>
                                </MDBModalContent>
                            </MDBModalDialog>
                        </MDBModal>
                    </>
                    :

                    <MDBContainer fluid className='d-flex h-[100vh] align-items-center justify-content-center bg-image'>
                        <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
                            <span className='cursor-pointer p-2' onClick={() => { setScreen(0); setCentredModal(true) }}>
                                <ArrowBack color='black' size={30} />
                            </span>
                            <MDBCardBody className='px-5'>
                                <MDBInput wrapperClass='mb-4' name='name' onChange={handleChange} value={data.name} label='Your Name' size='lg' id='name' type='text' />
                                {isMedical &&
                                    <>
                                        <MDBInput wrapperClass='mb-4' name='ShopName' onChange={handleChange} value={data.ShopName} label='Shop Name' size='lg' id='organization' type='text' />
                                        <MDBTextArea wrapperClass='mb-4' name='address' onChange={handleChange} value={data.address} label='Address' size='lg' id='form1' />
                                    </>
                                }
                                <MDBInput wrapperClass='mb-4' name='email' onChange={handleChange} value={data.email} label='Your Email' size='lg' id='form2' type='email' />
                                <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='form3' type='password' />
                                <MDBInput wrapperClass='mb-4' name='password' onChange={handleChange} value={data.password} label='Repeat your password' size='lg' id='form4' type='password' />
                                <div className='d-flex flex-row justify-content-center mb-4'>
                                    <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I agree all statements in Terms of service' />
                                </div>
                                <div>
                                    {!location && isMedical &&
                                        <MDBBtn color='secondary' onClick={getLocation}>
                                            Fetch Location
                                        </MDBBtn>}
                                </div>
                                <MDBBtn className='mb-4 w-100 mt-3 gradient-custom-4' size='lg' onClick={createAccount}>Register</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                        {
                            Loader.visible && <BigScreenLoader {...Loader} />}
                    </MDBContainer>
            }
        </>
    );
}


export const BigScreenLoader = ({ text = "", desc = "" }) => {
    return (
        <div style={{ position: 'absolute', height: '100vh', width: '100vw', zIndex: '9999', backgroundColor: "rgba(0,0,0,0.5)", alignItems: 'center', justifyContent: 'center' }} className='z-[9999] d-flex'>
            <div style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} className='d-flex flex-col justify-center items-center'>
                <CircularProgress size={19} />
                <p className='font-bold text-lg text-black'>{text}</p>
                <p className='text-sm text-black'>{desc}</p>
            </div>
        </div>
    )
}
export default Signup;