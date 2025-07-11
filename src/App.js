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
import Main from './Main';
import {Routes,Route} from 'react-router-dom'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path='/vrm' element={<Registeration/>}/>
      <Route path='/register' element={<Main/>}/>
      </Routes> 
    </ChakraProvider>
  );
}

export default App;
