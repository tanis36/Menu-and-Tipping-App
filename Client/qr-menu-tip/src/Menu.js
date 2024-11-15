import React from 'react';
import { Box, Heading, List, ListItem } from '@chakra-ui/react';

function Menu() {
    const drinks = ["Martini", "Mojito", "Old Fashioned", "Margarita"];

    return (
        <Box textAlign="center" py={10}>
            <Heading>Menu</Heading>
            <List spacing={3}>
                {drinks.map((drink, index) => (
                    <ListItem key={index}>{drink}</ListItem>
                ))}
            </List>
        </Box>
    );
}

export default Menu;