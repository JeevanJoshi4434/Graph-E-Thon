import React, { useState, useEffect } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import MyVerticallyCenteredModal from '../../Components/Modal';

export default function OrderTable({ data = [], more=false }) {
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

    const actionButtons = 
    <div className=' w-fit h-9 grid grid-cols-4 gap-2'>
        <MDBBtn color='info' >Ready to Ship</MDBBtn>
        <MDBBtn color='warning' >Shipped</MDBBtn>
        <MDBBtn color='success' >Delivered</MDBBtn>
        <MDBBtn color='Danger' >Cancel</MDBBtn>
    </div>;

    return (
        <div className='w-full'>
            <div className='h-9 w-full flex items-center justify-between px-2'>
                <div className='flex items-start flex-col'>
                    <h6>Orders</h6>
                    <MDBInput
                        type='text'
                        label='Search Order'
                        aria-label='Search Order'
                        size='sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {more && <MDBBtn href='/dashboard/orders' color='info' >View all</MDBBtn>}
            </div>
            <MDBTable align='middle'>
                <MDBTableHead>
                    <tr>
                        <th scope='col'>Name</th>
                        <th scope='col'>Items</th>
                        <th scope='col'>Status</th>
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
                                        <p className='text-muted mb-0'>{item.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className='fw-normal mb-1'>{item.items}</p>
                            </td>
                            <td>
                                <MDBBadge color={item.status === 5 ? 'success' : item.status === 7 ? 'danger' : 'warning'} pill>
                                    {item.progress}
                                </MDBBadge>
                            </td>
                            <td>₹{item.price}</td>
                            <td>
                                <MDBBtn color='link' onClick={() => setModal(true)} rounded size='sm'>
                                    Update Status
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
            <MyVerticallyCenteredModal show={modal} extra={actionButtons} onHide={() => setModal(false)} Heading='Update Status' ButtonText='Update' onConfirm={() => setModal(false)} Content='Are you sure you want to update status?' />
        </div>
    );
}
