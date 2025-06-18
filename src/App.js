import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import Registeration from './Registeration';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Registeration/> 
    </ChakraProvider>
  );
}

export default App;
