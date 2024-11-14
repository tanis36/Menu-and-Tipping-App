import React from 'react'
import { ChakraProvider, Box, Button, VStack, Heading } from '@chakra-ui/react';
// import { useStripe, Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

//TODO: get and add a key
// const stripePromise = loadStripe('');

function App() {
  return (
    <ChakraProvider>
      <Box textAlign="center" py={10}>
        <VStack spacing={5}>
          <Heading size="lg" onClick={() => window.location.href = '/'}>Bar 62</Heading>
          <Button colorScheme="teal" onClick={() => window.location.href = '/menu'}>Menu</Button>
          <Button colorScheme="blue" onClick={() => window.location.href = '/tip'}>Tip</Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;