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
import CollegeManager from './CollegeManager';
import ThankYou from './ThankYou';
import Attendence from './Attendence';
import CandidateExport from './CandidateExport';
import AttendanceList from './AttendanceList';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path='/vrm' element={<Registeration/>}/>
      <Route path='/register' element={<Main/>}/>
      <Route path='/college' element={<CollegeManager/>}/>
      <Route path='/thankyou' element= {<ThankYou/>}/>
      <Route path='/attendence' element= {<Attendence/>}/>
      <Route path='/admin' element={<CandidateExport/>}/>
      <Route path='/admin/attendance' element={<AttendanceList/>}/>
      
      </Routes> 
    </ChakraProvider>
  );
}

export default App;
