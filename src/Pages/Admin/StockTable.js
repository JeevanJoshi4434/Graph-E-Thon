import React, { useState, useEffect } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInputGroup, MDBInput } from 'mdb-react-ui-kit';
import MyVerticallyCenteredModal from '../../Components/Modal';

export default function StockTable({ data = [] }) {
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        // Filter data based on search text if it's not empty or contains only spaces
        if (search.trim() !== "") {
            const filtered = data.filter(item =>
                item.name.toLowerCase().includes(search.trim().toLowerCase()) || item.email.toLowerCase().includes(search.trim().toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            // If search is empty or contains only spaces, show all data
            setFilteredData(data);
        }
    }, [data, search]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [modal, setModal] = useState(false);

    return (
        <div className='w-full mt-4'>
            <div className='h-9 w-full flex items-center justify-between px-2'>
                <div className='flex items-start flex-col'>
                    <h6>Items in Stock</h6>
                    <MDBInput
                        type='text'
                        label='Search Order'
                        aria-label='Search Order'
                        size='sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <MDBInputGroup className='w-auto'>
                    <select className='form-select' onChange={(e) => setItemsPerPage(parseInt(e.target.value))}>
                        <option value='5'>5 per page</option>
                        <option value='10'>10 per page</option>
                        <option value='15'>15 per page</option>
                    </select>
                </MDBInputGroup>
            </div>
            <MDBTable align='middle'>
                <MDBTableHead>
                    <tr>
                        <th scope='col'>Name</th>
                        <th scope='col'>mg/ml</th>
                        <th scope='col'>Units</th>
                        <th scope='col'>Price</th>
                        <th scope='col'>Actions</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {currentItems.map(item => (
                        <tr key={item.id}>
                            <td>
                                <div className='d-flex align-items-center'>
                                    <img
                                        src={item.imageUrl}
                                        alt=''
                                        style={{ width: '45px', height: '45px' }}
                                        className='rounded-circle'
                                    />
                                    <div className='ms-3'>
                                        <p className='fw-bold mb-1'>{item.name}</p>
                                        <p className='text-muted mb-0'>{item.pillsPerBox} pills in a box</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <MDBBadge color={item.power < 400 ? 'success' : item.power >= 700 ? 'danger' : 'warning'} pill>
                                    {item.power}
                                </MDBBadge>
                            </td>
                            <td>
                                <MDBBadge color={item.quantity >= 25 ? 'success' : item.quantity <= 10 ? 'danger' : 'warning'} pill>
                                    {item.quantity}
                                </MDBBadge>
                            </td>
                            <td>₹{item.price}</td>
                            <td>
                                <MDBBtn color='link' onClick={() => setModal(true)} rounded size='sm'>
                                    Update Stock
                                </MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>
            {/* Pagination */}
            <nav className='d-flex justify-content-center'>
                <ul className='pagination'>
                    {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button onClick={() => paginate(i + 1)} className='page-link'>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <MyVerticallyCenteredModal show={modal} onHide={() => setModal(false)} Heading='Update Status' ButtonText='Update' onConfirm={() => setModal(false)} Content='Are you sure you want to update status?' />
        </div>
    );
}
