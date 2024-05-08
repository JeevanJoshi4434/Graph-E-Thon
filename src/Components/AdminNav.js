import React, { useState } from 'react';
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBIcon,
    MDBCollapse
} from 'mdb-react-ui-kit';
import MyVerticallyCenteredModal from './Modal';
import { Button, Modal } from 'react-bootstrap';
import AddStock from '../Pages/Admin/AddItem';
import axios from 'axios';

export default function Nav() {
    const [openNavSecond, setOpenNavSecond] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [modalShow2, setModalShow2] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const UploadData = async() => {
        try {
            const newData = filteredData.map(obj => {
                // Destructure the object to exclude the 'id' field
                const { id, ...rest } = obj;
                return rest; // Return the object without the 'id' field
            });
            
            const res = await axios.post('/api/v1/add/medicine',{
                medicines: newData
            })

            if(res.data.success){
                setFilteredData([]);
                setModalShow2(false);
                alert("Data added successfully"); 
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <MDBNavbar sticky expand='lg' light bgColor='light'>
                <MDBContainer fluid>
                    <MDBNavbarBrand href='#'>MEDICO</MDBNavbarBrand>
                    <MDBNavbarToggler
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        onClick={() => setOpenNavSecond(!openNavSecond)}
                    >
                        <MDBIcon icon='bars' fas />
                    </MDBNavbarToggler>
                    <MDBCollapse navbar open={openNavSecond}>
                        <MDBNavbarNav>
                            <MDBNavbarLink active aria-current='page' href='/dashboard'>
                                Dashboard
                            </MDBNavbarLink>
                            <MDBNavbarLink href='/dashboard/orders'>Orders</MDBNavbarLink>
                            <MDBNavbarLink href='/dashboard/stock'>Stock</MDBNavbarLink>
                            <MDBNavbarLink onClick={() => setModalShow2(true)}>Add Product</MDBNavbarLink>
                            <MDBNavbarLink onClick={() => setModalShow(true)} tabIndex={-1} aria-disabled='true'>
                                Update Shop Location
                            </MDBNavbarLink>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
            <MyVerticallyCenteredModal
                show={modalShow}
                Heading={"Update Location"}
                Content={" Are you sure you want to update your location?"}
                ButtonText={"Update"}
                onConfirm={() => { console.log("Confirmed"); setModalShow(false); }}
                onHide={() => setModalShow(false)}
            />
            <Modal
                show={modalShow2}
                onHide={() => setModalShow2(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <h4> Add Item </h4>
                    <AddStock filteredData={filteredData} setFilteredData={setFilteredData} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setModalShow2(false)}>Cancel</Button>
                    <Button onClick={UploadData}>Update</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}