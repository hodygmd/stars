import React, {useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Types from "./Pages/Types";
import Stars from "./Pages/Stars";
import DistanceUnits from "./Pages/DistanceUnits";

export default function App() {
    return (
        <>
            <div className={"d-flex"}>
                <Router>
                    <div className="border-right p-3" id="sidebar">
                        <div>
                            <a>
                                <h3 className="text-light">
                                    Menu
                                    <img className="float-end" id="imgPerfil"
                                         src="https://cdn.pixabay.com/photo/2023/03/06/13/58/logo-7833521_1280.png"/>
                                </h3>
                            </a>
                        </div>
                        <hr/>
                        <div className="list-group list-reset">
                            <Link to="/"><button className="btn btn-primary text-dark button mb-4"><span>Object</span></button></Link>
                            <Link to="/types"><button className="btn btn-primary text-dark button mb-4"><span>Types</span></button></Link>
                            <Link to="/distance_units"><button className="btn btn-primary text-dark button mb-4"><span>Distance Units</span></button></Link>
                        </div>
                    </div>
                    <Routes>
                        <Route path='/' element={<Stars/>}/>
                        <Route path='/types' element={<Types/>}/>
                        <Route path='/distance_units' element={<DistanceUnits/>}/>
                        <Route path="*" element={<NoMatch/>}/>
                    </Routes>
                </Router>
            </div>
        </>
    );
}
function NoMatch() {
    return (
        <>
            <div className={"container d-flex justify-content-center pt-5 mt-5"}>
                <div className={"flex-column pt-5 mt-5"}>
                    <div>
                        <h1 className={"pt-5"}>NOTHING TO SE HERE!</h1><br/>
                    </div>
                    <div className={"ms-3"}>
                        <Link to="/" className={"ps-5 ms-5"}>Go to the home page</Link>
                    </div>
                </div>
            </div>
        </>
    );
}