import React, { useState, useEffect, useRef } from 'react';
import { Box, Heading, Text, Input, VStack, Center } from '@chakra-ui/react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

function Tip() {
    const [tipAmount, setTipAmount] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [error, setError] = useState("");
    const [isAmountValid, setIsAmountValid] = useState(false);
    //console.log(tipAmount);
    
    useEffect(() => {
        console.log("13 Tip Amount:", tipAmount);  // This should log changes
    }, [tipAmount]);

    useEffect(() => {
        console.log("17 Is Amount Valid:", isAmountValid);  // This should log changes
    }, [isAmountValid]);

    const tipAmountRef = useRef(tipAmount);
    const isAmountValidRef = useRef(isAmountValid);
    
    const handleTipChange = (e) => {
        const value = e.target.value;

        if (/^\d+(\.\d{0,2})?$/.test(value)) {  // Allow up to 2 decimal places
            setTipAmount(value);
            tipAmountRef.current = value;
            setError("");  // Clear error
            console.log("38 Tip Amount Ref Current:", tipAmountRef.current);
    
            // Update validity state
            setIsAmountValid(validateAmount(value));
            isAmountValidRef.current = validateAmount(value);
            console.log("43 Set Is Amount Valid:", validateAmount(value));
            console.log("44 Is Amount Valid Ref Current:", isAmountValidRef.current);
        } else {
            setTipAmount("");
            setIsAmountValid(false);  // Invalid input format
            tipAmountRef.current = "";
            isAmountValidRef.current = false;
        }
    };

    const validateAmount = (value) => {
        const amount = parseFloat(value);
        if (amount <= 0) {
            setError("Please enter a valid tip amount.");
            return false;
        }
        return true;
    };

    return (
        <Box textAlign="center" py={10}>
            <Heading>Tip Bar 62</Heading>
            <Center>
            <VStack spacing={4}>
                <Input 
                    type="text"
                    placeholder="Enter tip amount"
                    value={tipAmountRef.current}
                    onChange={handleTipChange}
                    textAlign="center"
                />
                {error && <Text color="red.500">{error}</Text>}  {/* Display error message*/}
                <PayPalScriptProvider options={{ "client-id": "client_id" }}>
                    <PayPalButtons 
                        disabled={!isAmountValidRef.current}
                        createOrder={async () => {
                            console.log("createOrder triggered.")

                            const currentTip = tipAmountRef.current;

                            console.log("Tip Amount:", currentTip);
                            const res = await fetch('http://127.0.0.1:8000/create-paypal-order', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ amount: currentTip })
                            });

                            if (!res.ok) {
                                throw new Error("Failed to create PayPal order.");
                            }

                            const data = await res.json();
                            return data.orderID;
                        }}
                        onApprove={async (data) => {
                            const res = await fetch(`http://127.0.0.1:8000/capture-paypal-order/${data.orderID}`, {
                                method: 'POST'
                            });
                            const captureData = await res.json();
                            setPaymentStatus(`Payment successful! Thank you for your tip of $${tipAmountRef.current}!`);

                            setTipAmount("");
                            tipAmountRef.current = "";
                            setError("");
                            setIsAmountValid(false);
                            isAmountValidRef.current = false;
                        }}
                        onError={(err) => {
                            setPaymentStatus("Payment failed. Please try again.");
                            console.error(err);
                        }}
                    />
                </PayPalScriptProvider>
                {paymentStatus && <Text mt={3}>{paymentStatus}</Text>}
            </VStack>
            </Center>
        </Box>
    );
}

export default Tip;