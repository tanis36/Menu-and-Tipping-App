import React, { useState } from 'react';
import { Box, Heading, Button, Text } from '@chakra-ui/react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function Tip() {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState("");

    const handleSubmit = async () => {
        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const clientSecret = await fetch('/create-payment-intent', {
            method: 'POST',
        }).then(res => res.json()).then(data => data.clientSecret);

        if (clientSecret) {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (error) {
                setPaymentStatus(`Payment failed: ${error.message}`);
            } else if (paymentIntent.status === 'succeeded') {
                setPaymentStatus("Payment succeeded! Thank you for your tip!");
            }
        }
    };

    return (
        <Box textAlign="center" py={10}>
            <Heading>Tip Bar 62</Heading>
            <form>
                <CardElement />
                <Button mt={5} colorScheme="blue" onClick={handleSubmit} disabled={!stripe}>
                    Tip
                </Button>
            </form>
            {paymentStatus && <Text mt={3}>{paymentStatus}</Text>}
        </Box>
    );
}

export default Tip;