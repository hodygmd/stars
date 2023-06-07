import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {DistanceUnit, Star, Type} from "../Interfaces/Star";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

const Stars: React.FC = () => {
    const baseUrl: string = "http://ec2-3-141-42-138.us-east-2.compute.amazonaws.com:8081"
    const apiKey: string = "apiKey=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmZWxpIiwiaWQiOjIsImlhdCI6MTY4NjEyNzk5OSwiZXhwIjoxNjg2OTkxOTk5fQ.0IJKVscnGy7MEHCJKMFmRiBNNyRuG3-qfuWEEQ-yNqg"
    const [data, setData] = useState<Star[]>([]);
    const [distance, setDistance] = useState<DistanceUnit[]>([]);
    const [type, setType] = useState<Type[]>([]);

    useEffect(() => {
        axios.get<Star[]>(`${baseUrl}/stars?${apiKey}`)
            .then(response => {
                //console.log(response.data)
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        axios.get<DistanceUnit[]>(`${baseUrl}/distance_units?${apiKey}`)
            .then(response => {
                //console.log(response.data)
                setDistance(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        axios.get<Type[]>(`${baseUrl}/star-types?${apiKey}`)
            .then(response => {
                //console.log(response.data)
                setType(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [name, setName] = useState('')
    const [mass, setMass] = useState(0)
    const [idDist, setIdDist] = useState(0)
    const [dist, setDist] = useState(0)
    const [idType, setIdType] = useState(0)
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }
    const handleMassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMass(parseFloat(event.target.value))
    }
    const handleIdDistChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIdDist(parseInt(event.target.value))
    }
    const handleDistChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDist(parseFloat(event.target.value))
    }
    const handleIdTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setIdType(parseInt(event.target.value))
    }
    const [showModal, setShowModal] = useState(false)
    const handleShowModal = () => {
        setShowModal(true)
    }
    const handleCloseModal = () => {
        setShowModal(false)
        setButtonSubmitText('Add')
        setNull()
    }
    const [edit, setEdit] = useState(false)
    const [buttonSubmitText, setButtonSubmitText] = useState('Add')
    const [indexToEdit, setIndexToEdit] = useState(0)
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let unit=distance[idDist-1].unit
        let typ=type[idType-1].type
        let desc=type[idType-1].description
        if (!edit) {
            axios.post<Star>(`${baseUrl}/stars?${apiKey}`, {
                name: name,
                mass: mass,
                id_distance_unit: {id: idDist, unit: unit, status: 1},
                distance: dist,
                id_type: {id: idType, type: typ, description: desc, status: 1},
                status: 1
            })
                .then(response => {
                    console.log(response.data)
                    const newData: Star[] = [
                        ...data,
                        {
                            id: response.data.id,
                            name: response.data.name,
                            mass: response.data.mass,
                            id_distance_unit: {
                                id: response.data.id_distance_unit.id,
                                unit: response.data.id_distance_unit.unit,
                                status: response.data.id_distance_unit.status
                            },
                            distance: response.data.distance,
                            id_type: {
                                id: response.data.id_type.id,
                                type: response.data.id_type.type,
                                description: response.data.id_type.description,
                                status: response.data.id_type.status
                            },
                            status: response.data.status
                        }
                    ]
                    setData(newData)
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            axios.put<Star>(`${baseUrl}/stars/${data[indexToEdit].id}?${apiKey}`, {
                id: data[indexToEdit].id,
                name: name,
                mass: mass,
                id_distance_unit: {id: idDist, unit: unit, status: 1},
                distance: dist,
                id_type: {id: idType, type: typ, description: desc, status: 1},
                status: 1
            })
                .then(response => {
                    const updatedData = data.map(item => {
                        if (item.id === data[indexToEdit].id) {
                            return {
                                ...item,
                                name: name,
                                mass: mass,
                                id_distance_unit: {id: idDist, unit: unit,status:1},
                                distance: dist,
                                id_type: {id: idType, type: typ, description: desc,status:1}
                            };
                        }
                        return item;
                    })
                    setData(updatedData)
                })
                .catch(error => {
                    console.log(error);
                });
            setButtonSubmitText('Add')
            setEdit(false)
        }
        setNull()
        setShowModal(false)
    }
    const deleteElement = (id: number, name: string, mass: number, id_distance_unit: number, unit: string, distance: number, id_type: number, type: string, desc: string) => {
        axios.put<Star>(`${baseUrl}/stars/remove/${id}?${apiKey}`, {
            id: id,
            name: name,
            mass: mass,
            id_distance_unit: {id: id_distance_unit, unit: unit, status: 1},
            distance: distance,
            id_type: {id: id_type, type: type, description: desc, status: 1},
            status: 0
        })
            .then(response => {
                setData(data.filter(obj => obj.id !== id))
            })
            .catch(error => {
                console.log(error);
            });
    }
    const setNull = () => {
        setName('')
        setMass(0)
        setIdDist(0)
        setDist(0)
        setIdType(0)
    }
    const editElement = (index: number) => {
        setEdit(true)
        setButtonSubmitText('Edit')
        setName(data[index].name)
        setMass(data[index].mass)
        setIdDist(data[index].id_distance_unit.id)
        setDist(data[index].distance)
        setIdType(data[index].id_type.id)
        setIndexToEdit(index)
        handleShowModal()
    }
    return (
        <>
            <div className={"container pt-5"}>
                <div className={"row d-flex justify-content-center"}>
                    <div className={"col-2 d-flex justify-content-center py-3 rounded-5"}
                         style={{backgroundColor: "rgba(38,30,30,0.56)"}}>
                        <button className={"btn btn-outline-danger"} onClick={() => handleShowModal()}>Add New Star
                        </button>
                    </div>
                </div>
                <div className={"row text-uppercase mt-5"}>
                    {data.map((item, index: number) => (
                        <div className={"mb-4 mx-5 p-2 col-3 buttons"}>
                            <p className={"text-center"}>{item.name}</p>
                            mass: {item.mass} M☉<br/>
                            distance: {item.distance} {item.id_distance_unit.unit}<br/>
                            type: {item.id_type.type}
                            <hr/>
                            <div className={"d-flex justify-content-center"}>
                                <button className={"btn btn-outline-info me-3"}
                                        onClick={() => editElement(index)}>Edit
                                </button>
                                <button className={"btn btn-outline-warning"}
                                        onClick={() => deleteElement(item.id, item.name, item.mass, item.id_distance_unit.id, item.id_distance_unit.unit, item.distance, item.id_type.id, item.id_type.type, item.id_type.description)}>Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                {showModal &&
                    <Modal isOpen={showModal} toggle={() => handleShowModal()}>
                        <form onSubmit={handleSubmit}>
                            <ModalHeader style={{backgroundColor: "#347094"}}>Astronomical Object</ModalHeader>
                            <ModalBody style={{backgroundColor: "#4e86a9"}}>
                                <label>
                                    Name:<input className={"ms-2"} type={"text"} value={name} required
                                                onChange={handleNameChange}/>
                                </label>
                                <br/><br/>
                                <label>
                                    Mass:<input className={"ms-2"} type={"number"} value={mass} required
                                                onChange={handleMassChange}/>
                                </label>
                                <br/><br/>
                                <label>
                                    Distance Unit:
                                    <select className={"ms-3"} value={idDist} onChange={handleIdDistChange}>
                                        <option value={0} selected>--Selecciona--</option>
                                        {distance.map((item) => (
                                            <option value={item.id}>{item.unit}</option>
                                        ))}
                                    </select>
                                </label>
                                <br/><br/>
                                <label>
                                    Distance:<input className={"ms-2"} type={"number"} value={dist} required
                                                    onChange={handleDistChange}/>
                                </label>
                                <br/><br/>
                                <label>
                                    Type:
                                    <select className={"ms-3"} value={idType} onChange={handleIdTypeChange}>
                                        <option value={0} selected>--Selecciona--</option>
                                        {type.map((item) => (
                                            <option value={item.id}>{item.type}</option>
                                        ))}
                                    </select>
                                </label>
                            </ModalBody>
                            <ModalFooter style={{backgroundColor: "#347094"}}>
                                <Button color={"success"} type={"submit"}>{buttonSubmitText}</Button>
                                <Button color={"danger"} onClick={() => handleCloseModal()}>Cancel</Button>
                            </ModalFooter>
                        </form>
                    </Modal>
                }
            </div>
        </>
    );
};

export default Stars;