import React from 'react'
import { ChakraProvider, Box, Heading } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Menu from './Menu';
import Tip from './Tip';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Box textAlign="center" py={5}>
          <Link to="/">
            <Heading as="h1" size="lg" cursor="pointer">Bar 62</Heading>
          </Link>
        </Box>
        <Box textAlign="center" py={5}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/tip" element={<Tip />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;