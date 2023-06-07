import React, {useEffect, useState} from "react";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {Type} from "../Interfaces/Star";
import axios from "axios";

export default function Types() {
    const baseUrl: string = "http://ec2-3-141-42-138.us-east-2.compute.amazonaws.com:8081/star-types"
    const apiKey: string = "apiKey=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmZWxpIiwiaWQiOjIsImlhdCI6MTY4NjEyNzk5OSwiZXhwIjoxNjg2OTkxOTk5fQ.0IJKVscnGy7MEHCJKMFmRiBNNyRuG3-qfuWEEQ-yNqg"
    const [data, setData] = useState<Type[]>([]);

    useEffect(() => {
        axios.get<Type[]>(`${baseUrl}?${apiKey}`)
            .then(response => {
                console.log(response.data)
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [type, setType] = useState('')
    const [desc, setDesc] = useState('')
    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setType(event.target.value)
    }
    const handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDesc(event.target.value)
    }
    const [showModal, setShowModal] = useState(false)
    const handleShowModal = () => {
        setShowModal(true)
    }
    const handleCloseModal = () => {
        setShowModal(false)
        setButtonSubmitText('Add')
        setType('')
        setDesc('')
    }
    const [edit, setEdit] = useState(false)
    const [buttonSubmitText, setButtonSubmitText] = useState('Add')
    const [indexToEdit, setIndexToEdit] = useState(0)
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!edit) {
            axios.post<Type>(`${baseUrl}?${apiKey}`, {type: type, description: desc, status: 1})
                .then(response => {
                    console.log(response.data)
                    const newData: Type[] = [
                        ...data,
                        {
                            id: response.data.id,
                            type: response.data.type,
                            description: response.data.description,
                            status: response.data.status
                        }
                    ]
                    setData(newData)
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            axios.put<Type>(`${baseUrl}/${data[indexToEdit].id}?${apiKey}`, {
                id: data[indexToEdit].id,
                type: type,
                description: desc,
                status: 1
            })
                .then(response => {
                    const updatedData = data.map(item => {
                        if (item.id === data[indexToEdit].id) {
                            return {...item, type: type, description: desc};
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
        setType('')
        setDesc('')
        setShowModal(false)
    }
    const deleteElement = (id: number, type: string, desc: string) => {
        axios.put<Type>(`${baseUrl}/remove/${id}?${apiKey}`, {id: id, type: type, description: desc, status: 0})
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
        setType(data[index].type)
        setDesc(data[index].description)
        setIndexToEdit(index)
        handleShowModal()
    }
    return (
        <>
            <div className={"container pt-5"}>
                <div className={"row d-flex justify-content-center"}>
                    <div className={"col-2 d-flex justify-content-center py-3 rounded-5"}
                         style={{backgroundColor: "rgba(38,30,30,0.56)"}}>
                        <button className={"btn btn-outline-danger"} onClick={() => handleShowModal()}>Add New Type
                        </button>
                    </div>
                </div>
                <div className={"row text-uppercase mt-5"}>
                    {data.map((item, index: number) => (
                        <div className={"mb-4 mx-5 p-2 col-3 buttons"}>
                            <p className={"text-center"}>{item.type}<br/></p>
                            {item.description}
                            <hr/>
                            <div className={"d-flex justify-content-center"}>
                                <button className={"btn btn-outline-info me-3"}
                                        onClick={() => editElement(index)}>Edit
                                </button>
                                <button className={"btn btn-outline-warning"}
                                        onClick={() => deleteElement(item.id, item.type, item.description)}>Delete
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
                            <ModalHeader style={{backgroundColor: "#347094"}}>Type</ModalHeader>
                            <ModalBody style={{backgroundColor: "#4e86a9"}}>
                                <label>
                                    Type:<br/>
                                    <input type={"text"} value={type} onChange={handleTypeChange} required
                                           style={{width: "18rem"}}/>
                                </label>
                                <br/><br/>
                                <label>
                                    Description:<br/>
                                    <textarea value={desc} onChange={handleDescChange} required
                                              style={{width: "29rem", height: "10rem"}}/>
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