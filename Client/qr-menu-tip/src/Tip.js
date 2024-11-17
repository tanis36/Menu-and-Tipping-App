import React, { useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

function Tip() {
    const [paymentStatus, setPaymentStatus] = useState("");

    return (
        <Box textAlign="center" py={10}>
            <Heading>Tip Bar 62</Heading>
            <PayPalScriptProvider options={{ "client-id": "CLIENT_ID" }}>
                <PayPalButtons 
                    createOrder={async () => {
                        const res = await fetch('http://127.0.0.1:8000/create-paypal-order', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ amount: 10.00 })
                        });
                        const data = await res.json();
                        return data.orderID;
                    }}
                    onApprove={async (data, actions) => {
                        const res = await fetch(`http://127.0.0.1:8000/capture-paypal-order/${data.orderID}`, {
                            method: 'POST'
                        });
                        const captureData = await res.json();
                        setPaymentStatus("Payment successful! Thank you for your tip!");
                    }}
                    onError={(err) => {
                        setPaymentStatus("Payment failed. Please try again.");
                    }}
                />
            </PayPalScriptProvider>
            {paymentStatus && <Text mt={3}>{paymentStatus}</Text>}
        </Box>
    );
}

export default Tip;