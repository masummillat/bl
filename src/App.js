import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import ReadXlsx from "./ReadXlsx.js";


class App extends Component {
    render() {


        return (
            <div className="App">
                <h1>SLA STATUS CHECKER</h1>
                <ReadXlsx/>
            </div>
        );
    }
}

export default App;
