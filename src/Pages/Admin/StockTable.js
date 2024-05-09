import React, { useState, useEffect } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInputGroup, MDBInput } from 'mdb-react-ui-kit';
import MyVerticallyCenteredModal from '../../Components/Modal';
import axios from 'axios';

export default function StockTable({ data = [] }) {
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [update, setUpdate] = useState({
        selectedId: null || String,
        started: false || Boolean,
        quantity: null || Number
    });
    const [currentItems, setCurrentItems] = useState([]); // State for currentItems
    const [indexOfFirstItem, setIndexOfFirstItem] = useState(currentPage * itemsPerPage);
    const [indexOfLastItem, setIndexOfLastItem] = useState(itemsPerPage);
    const quantityInput = <MDBInput type="number" value={update.quantity} onChange={(e) => setUpdate({ ...update, quantity: e.target.value })} label="Quantity" />;

    useEffect(() => {
        // Filter data based on search text if it's not empty or contains only spaces
        if (search.trim() !== "") {
            const filtered = data.filter(item =>
                item.name.toLowerCase().includes(search.trim().toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            // If search is empty or contains only spaces, show all data
            setFilteredData(data);
        }
    }, [data, search]);

    useEffect(() => {
        // Logic to update currentItems whenever filteredData or currentPage changes
        setIndexOfLastItem(currentPage * itemsPerPage);
        setIndexOfFirstItem(indexOfLastItem - itemsPerPage);
        const newCurrentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentItems(newCurrentItems);
    }, [filteredData, currentPage, itemsPerPage]);

    const updateQuantity = async () => {
        try {
            const res = await axios.post('/api/v1/reduce/inventory', {
                productDetail: {
                    _id: update.selectedId,
                    quantity: update.quantity
                }
            });
            if (res.data.success) {
                const updatedData = [...data]; // Create a copy of data array
                const itemIndex = updatedData.findIndex(item => item._id === update.selectedId);
                if (itemIndex !== -1) {
                    updatedData[itemIndex].quantity = update.quantity; // Update quantity in the copied data array
                    const updatedFilteredData = [...filteredData]; // Create a copy of filteredData array
                    const filteredItemIndex = updatedFilteredData.findIndex(item => item._id === update.selectedId);
                    if (filteredItemIndex !== -1) {
                        updatedFilteredData[filteredItemIndex].quantity = update.quantity; // Update quantity in the copied filteredData array
                        setFilteredData(updatedFilteredData); // Update filteredData state with the new quantity
                        const newCurrentItems = updatedFilteredData.slice(indexOfFirstItem, indexOfLastItem); // Update currentItems with the new filteredData
                        setCurrentItems(newCurrentItems); // Update currentItems state with the new items
                    }
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUpdate({
                selectedId: null,
                started: false,
                quantity: null
            });
            setModal(false);
        }
    };


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
                                <MDBBtn color='link' onClick={() => { setModal(true); setUpdate({ selectedId: item._id, started: true, quantity: item.quantity }) }} rounded size='sm'>
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
            <MyVerticallyCenteredModal show={modal} onHide={() => setModal(false)} Heading='Update Quantity' ButtonText='Update' onConfirm={updateQuantity} Content='Are you sure you want to update the quantity?' extra={quantityInput} />
        </div>
    );
}
