import React, {useEffect, useState} from "react";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';
import {DistanceUnit} from "../Interfaces/Star";
import axios from "axios";
import '../App.css';

export default function DistanceUnits() {
    const baseUrl: string = 'http://localhost:8080/distance_units'
    const [data, setData] = useState<DistanceUnit[]>([]);

    useEffect(() => {
        axios.get<DistanceUnit[]>(`${baseUrl}`)
            .then(response => {
                console.log(response.data)
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [unit, setUnit] = useState('')
    const handleUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUnit(event.target.value)
    }
    const [showModal, setShowModal] = useState(false)
    const handleShowModal = () => {
        setShowModal(true)
    }
    const handleCloseModal = () => {
        setShowModal(false)
        setButtonSubmitText('Add')
        setUnit('')
    }
    const [edit, setEdit] = useState(false)
    const [buttonSubmitText, setButtonSubmitText] = useState('Add')
    const [indexToEdit, setIndexToEdit] = useState(0)
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!edit) {
            axios.post<DistanceUnit>(`${baseUrl}`, {unit: unit, status: 1})
                .then(response => {
                    console.log(response.data)
                    const newData: DistanceUnit[] = [
                        ...data,
                        {id: response.data.id, unit: response.data.unit, status: response.data.status}
                    ]
                    setData(newData)
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            axios.put<DistanceUnit>(`${baseUrl}/${data[indexToEdit].id}`, {
                id: data[indexToEdit].id,
                unit: unit,
                status: 1
            })
                .then(response => {
                    const updatedData = data.map(item => {
                        if (item.id === data[indexToEdit].id) {
                            return {...item, unit: unit};
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
        setUnit('')
        setShowModal(false)
    }
    const deleteElement = (id: number, unit: string) => {
        axios.put<DistanceUnit>(`${baseUrl}/remove/${id}`, {id: id, unit: unit, status: 0})
            .then(response => {
                setData(data.filter(obj => obj.id !== id))
            })
            .catch(error => {
                console.log(error);
            });
    }
    const editElement = (index: number) => {
        setEdit(true)
        setButtonSubmitText('Edit')
        setUnit(data[index].unit)
        setIndexToEdit(index)
        handleShowModal()
    }
    return (
        <>
            <div className={"container pt-5"}>
                <div className={"row d-flex justify-content-center"}>
                    <div className={"col-2 d-flex justify-content-center py-3 rounded-5"}
                         style={{backgroundColor: "rgba(38,30,30,0.56)"}}>
                        <button className={"btn btn-outline-danger"} onClick={() => handleShowModal()}>Add New Unit
                        </button>
                    </div>
                </div>
                <div className={"row text-uppercase mt-5"}>
                    {data.map((item, index: number) => (
                        <div className={"mb-4 mx-5 p-2 col-3 buttons"}>
                            <p className={"text-center"}>{item.unit}</p>
                            <hr/>
                            <div className={"d-flex justify-content-center"}>
                                <button className={"btn btn-outline-info me-3"}
                                        onClick={() => editElement(index)}>Edit
                                </button>
                                <button className={"btn btn-outline-warning"}
                                        onClick={() => deleteElement(item.id, item.unit)}>Delete
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
                            <ModalHeader style={{backgroundColor: "#347094"}}>Distance Unit</ModalHeader>
                            <ModalBody style={{backgroundColor: "#4e86a9"}}>
                                <label>
                                    Unit:<br/>
                                    <input type={"text"} value={unit} onChange={handleUnitChange} required
                                           style={{width: "18rem"}}/>
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
}