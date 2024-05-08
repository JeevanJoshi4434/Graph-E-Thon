import React from 'react'
import OrderTable from './OrderTable'
import Nav from '../../Components/AdminNav'
import { MDBBadge, MDBBtn } from 'mdb-react-ui-kit';
import StockTable from './StockTable';
import MarkOptimization from './Chart';

const Orders = () => {
  const dummyData = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@gmail.com",
      status: 5,
      items: "Paracetamol, Aspirin, Ibuprofen",
      price: 500,
      progress: "Delivered",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Alex Ray",
      email: "alex.ray@gmail.com",
      items: "Paracetamol, Aspirin",
      status: 1,
      progress: "Shipped",
      price: 600,
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Kate Hunington",
      email: "kate.hunington@gmail.com",
      items: "Aspirin, Ibuprofen",
      progress: "Cancelled Order",
      status: 7,
      price: 700,
      imageUrl: "https://via.placeholder.com/150",
    },
  ];

  const dummyMedicineData = [

    {
      id: 1,
      name: "Paracetamol",
      imageUrl: "https://via.placeholder.com/150",
      power: 200,
      price: 500,
      quantity: 10,
      pillsPerBox: 10
    },
    {
      id: 2,
      name: "Aspirin",
      imageUrl: "https://via.placeholder.com/150",
      power: 500,
      price: 500,
      quantity: 20,
      pillsPerBox: 14
    },
    {
      id: 3,
      name: "Ibuprofen",
      imageUrl: "https://via.placeholder.com/150",
      power: 500,
      price: 500,
      quantity: 10,
      pillsPerBox: 30
    },
    {
      id: 4,
      name: "Panadol",
      imageUrl: "https://via.placeholder.com/150",
      power: 500,
      price: 500,
      quantity: 30,
      pillsPerBox: 10
    },
    {
      id: 5,
      name: "Cetaphil",
      imageUrl: "https://via.placeholder.com/150",
      power: 500,
      price: 500,
      quantity: 10,
      pillsPerBox: 10
    },
    {
      id: 6,
      name: "Cipla",
      imageUrl: "https://via.placeholder.com/150",
      power: 500,
      price: 500,
      quantity: 10,
      pillsPerBox: 15
    },
    {
      id: 7,
      name: "Cipla",
      imageUrl: "https://via.placeholder.com/150",
      power: 500,
      price: 500,
      quantity: 10,
      pillsPerBox: 10
    },
    {
      id: 8,
      name: "Cipla",
      imageUrl: "https://via.placeholder.com/150",
      power: 750,
      price: 500,
      quantity: 10,
      pillsPerBox: 10
    },
    {
      id: 9,
      name: "Cipla",
      imageUrl: "https://via.placeholder.com/150",
      power: 500,
      price: 500,
      quantity: 10,
      pillsPerBox: 10
    },
  ]
  return (
    <div>
      <Nav />
      <div className=' h-full w-full grid md:grid-cols-2 grid-cols-1 gap-2 p-3'>
        <div className=' h-full w-full grid md:grid-cols-2 grid-cols-1 gap-2 p-3'>
          <div class="card text-center ">
            <div class="card-body">
              <h5 class="card-title">Earning:</h5>
              <p class="card-text">
                ₹5000
              </p>
              <p className='text'>
                <MDBBadge color='success' pill>{((5000/(1200+5000))*100).toFixed(2)}% Profit</MDBBadge>
              </p>
            </div>
            <div class="card-footer">last 30 days</div>
          </div>
          <div class="card text-center ">
            <div class="card-body">
              <h5 class="card-title">Loss:</h5>
              <p class="card-text">
                ₹1200
              </p>
              <p className='text'>
                <MDBBadge color='danger' pill>{((1200/(1200+5000))*100).toFixed(2)}% Loss</MDBBadge>
              </p>
            </div>
            <div class="card-footer">last 30 days</div>
          </div>
        </div>
        <MarkOptimization />
      </div>
      <div className=' h-full w-full grid md:grid-cols-1 grid-cols-1 gap-2 p-3'>
        <OrderTable data={dummyData} />
      </div>
    </div>
  )
}

export default Orders