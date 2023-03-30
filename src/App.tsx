import React from 'react';
import './assets/css/global.css';
import { createYear } from './utils/helpers/date/createYear';

console.log(createYear().createYearMonths());
const App: React.FC = () => <div className='app__container'>Calendar</div>;

export default App;
