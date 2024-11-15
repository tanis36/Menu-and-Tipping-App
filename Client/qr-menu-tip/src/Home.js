import React from 'react';
import { VStack, Heading, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <VStack spacing={5}>
            <Link to="/menu">
                <Button colorScheme="teal">Menu</Button>
            </Link>
            <Link to="/tip">
                <Button colorScheme="blue">Tip</Button>
            </Link>
        </VStack>
    );
}

export default Home;