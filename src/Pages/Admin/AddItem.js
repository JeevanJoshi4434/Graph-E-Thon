import React, { useState } from 'react';
import { MDBBtn, MDBInput, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdb-react-ui-kit';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

export default function AddStock({filteredData, setFilteredData}) {
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        id: '',
        name: '',
        imageUrl: 'https://static.vecteezy.com/system/resources/previews/000/637/367/original/vector-medicine-icon-symbol-sign.jpg',
        power: '',
        price: '',
        quantity: '',
        pillsPerBox: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddProduct = () => {
        setFilteredData(prevData => [...prevData, newProduct]);
        setModal(false);
        setNewProduct({
            id: '',
            name: '',
            imageUrl: 'https://static.vecteezy.com/system/resources/previews/000/637/367/original/vector-medicine-icon-symbol-sign.jpg',
            power: '',
            price: '',
            quantity: '',
            pillsPerBox: ''
        });
    };
    
    const handleDeleteProduct = (id) => {
        const updatedData = filteredData.filter(item => item.id !== id);
        setFilteredData(updatedData);
    };

    return (
        <div className='w-full mt-4'>
            <div className='h-9 w-full flex items-center justify-between px-2'>
                <div className='flex items-start flex-col'>
                    <h6>Items to Add in Stock</h6>
                    <MDBInput
                        type='text'
                        label='Search Order'
                        aria-label='Search Order'
                        size='sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <MDBBtn color='info' onClick={() => setModal(true)}>Add Product</MDBBtn>
            </div>
            <Modal show={modal} onHide={() => setModal(false)}>
                <Modal.Header>Add Product</Modal.Header>
                <Modal.Body>
                    <MDBInput className='my-2' type="text" label="Name" name="name" value={newProduct.name} onChange={handleInputChange} />
                    <MDBInput className='my-2' type="number" label="Power" name="power" value={newProduct.power} onChange={handleInputChange} />
                    <MDBInput className='my-2' type="number" label="Price" name="price" value={newProduct.price} onChange={handleInputChange} />
                    <MDBInput className='my-2' type="number" label="Quantity" name="quantity" value={newProduct.quantity} onChange={handleInputChange} />
                    <MDBInput className='my-2' type="number" label="Pills Per Box" name="pillsPerBox" value={newProduct.pillsPerBox} onChange={handleInputChange} />
                </Modal.Body>
                <Modal.Footer>
                    <MDBBtn color='secondary' onClick={() => setModal(false)}>Cancel</MDBBtn>
                    <MDBBtn color='primary' onClick={handleAddProduct}>Add</MDBBtn>
                </Modal.Footer>
            </Modal>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Power</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Pills Per Box</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td><img src={product.imageUrl} alt={product.name} style={{ width: '50px' }} /></td>
                            <td>{product.power}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.pillsPerBox}</td>
                            <td>
                                <MDBBtn color="danger" onClick={() => handleDeleteProduct(product.id)}>Delete</MDBBtn>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
