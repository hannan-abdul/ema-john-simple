import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../App';
import { getDatabaseCart, processOrder } from '../../utilities/databaseManager';
import ProcessPayment from '../ProcessPayment/ProcessPayment';
import './Shipment.css';

const Shipment = () => {
    const { register, handleSubmit, watch, errors } = useForm();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [shippingData, setShippingData] = useState(null);
    const onSubmit = data => {
        // console.log(data)
        setShippingData(data);
    };

    const handlePaymentSuccess = paymentId =>{
        const savedCart = getDatabaseCart();
        const orderDetails = { 
            ...loggedInUser, 
            products: savedCart, 
            shipment: shippingData, 
            paymentId,
            orderTime: new Date() 
        };

        fetch('https://blooming-beach-96972.herokuapp.com/addOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    processOrder();
                    alert('you order placed successfully');
                }
            })
    }

    console.log(watch("example"));

    return (
        <div className="row">
            <div style={{display: shippingData ? 'none': 'block'}} className="col-md-6">
                < form className="ship-form" onSubmit={handleSubmit(onSubmit)} >
                    < input name="name" defaultValue={loggedInUser.name} ref={register({ required: true })} placeholder="Your Name" />
                    {errors.name && <span className="error">Name is required</span>}

                    < input name="email" defaultValue={loggedInUser.email} ref={register({ required: true })} placeholder="Your Email" />
                    {errors.email && <span className="error">Email is required</span>}

                    < input name="address" ref={register({ required: true })} placeholder="Your Address" />
                    {errors.address && <span className="error">Address is required</span>}

                    < input name="phone" ref={register({ required: true })} placeholder="Your Phone" />
                    {errors.phone && <span className="error">Phone is required</span>}
                    <input type="submit" />
                </form >
            </div>
            <div style={{display: shippingData ? 'block': 'none'}} className="col-md-6">
                <h2>Please Pay</h2>
                <ProcessPayment handlePayment={handlePaymentSuccess}></ProcessPayment>
            </div>
        </div>
    );
};

export default Shipment;