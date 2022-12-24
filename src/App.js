import "./App.css";
import { observer, inject } from "mobx-react";
import { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Spin, Typography, Upload } from "antd";
import "./assets/less/todo.style.less";
import { DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";

function App({ todo, todoModal }) {
    const [d, setD] = useState([]);
    const [modalInit, setModalInit] = useState({});
    const [myForm] = Form.useForm();
    const [myFormModal] = Form.useForm();

    useEffect(() => {
        todo.fetchAllToDos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (todo.dataList.data) {
            setD(todo.dataList.data);
        }
    }, [todo.dataList]);

    useEffect(() => {
        if (todo.singleToDo.data && todo.singleToDo.data.length > 0) {
            setModalInit({
                ...todo.singleToDo.data[0],
                image: todo.singleToDo.data[0].image
                    ? [
                          {
                              uid: "-1",
                              // name: /[.]/.exec(todo.singleToDo.data[0].image)
                              //     ? /[^.]+$/.exec(todo.singleToDo.data[0].image)
                              //     : undefined,
                              name: todo.singleToDo.data[0].image.split("/").pop(),
                              status: "done",
                              url: todo.singleToDo.data[0].image,
                              thumbUrl: todo.singleToDo.data[0].image,
                          },
                      ]
                    : [],
            });
        }
    }, [todo.singleToDo]);

    useEffect(() => {
        myFormModal.resetFields();
    }, [modalInit, myFormModal]);

    const getBase64 = (file, callBack) => {
        todo.updateLoadingStatus(true);
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            callBack(reader.result);
        };
        reader.onerror = function (error) {};
    };

    const insertToDo = async (values) => {
        if (values.image && values.image.file) {
            getBase64(values.image.file, async (data) => {
                values.image = data;
                await todo.insertToDo(values, myForm);
            });
        } else {
            await todo.insertToDo(values, myForm);
        }
    };

    const deleteToDo = async (id) => {
        await todo.deleteToDo(id);
    };

    const editToDo = async (id) => {
        await todo.fetchSingleToDo(id);
    };

    const updateToDo = async (values) => {
        if (values.image && values.image.file) {
            if (values.image.fileList && values.image.fileList.length === 0) {
                values.image = null;
                await todo.updateToDo(values, myFormModal);
            } else {
                getBase64(values.image.file, async (data) => {
                    values.image = data;
                    await todo.updateToDo(values, myFormModal);
                });
            }
        } else {
            delete values.image;
            await todo.updateToDo(values, myFormModal);
        }
    };

    return (
        <Spin spinning={todo.isFetchingData} style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="m-container">
                <Row id="myForm" className="my-3" gutter={24}>
                    <Col span={24}>
                        <Form initialValues={{}} layout="vertical" form={myForm} onFinish={insertToDo}>
                            <Form.Item
                                label="ToDo Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "ToDo Name is Required!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="ToDo Description"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: "ToDo Description is Required!",
                                    },
                                ]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item name="image">
                                <Upload
                                    listType="picture"
                                    maxCount={1}
                                    defaultFileList={[]}
                                    beforeUpload={() => {
                                        return false;
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Upload/Change</Button>
                                </Upload>
                            </Form.Item>
                            <Button htmlType="submit" type="primary" block>
                                Insert ToDo
                            </Button>
                        </Form>
                    </Col>
                </Row>

                <Row className="my-3" gutter={24}>
                    <ul className="m-list-wrapper">
                        {d.map((element) => {
                            return (
                                <li className="list-group-item py-2" key={element.id}>
                                    <div className="m-image">
                                        <img src={element.image || "https://www.kindpng.com/picc/m/24-248729_stockvader-predicted-adig-user-profile-image-png-transparent.png"} alt="Loading...." />
                                    </div>
                                    <div className="m-content">
                                        <div className="m-title">{element.name}</div>
                                        <div className="m-description">{element.description}</div>
                                    </div>
                                    <div className="m-action">
                                        <Popconfirm title="Are you sure,to Delete this ToDo?" onConfirm={() => deleteToDo(element.id)} okText="Yes" cancelText="No">
                                            <Typography.Link>
                                                <DeleteOutlined />
                                            </Typography.Link>
                                        </Popconfirm>
                                        <Popconfirm title="Are you sure,to Edit this ToDo?" onConfirm={() => editToDo(element.id)} okText="Yes" cancelText="No">
                                            <Typography.Link>
                                                <EditOutlined />
                                            </Typography.Link>
                                        </Popconfirm>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </Row>
            </div>

            <Modal footer={null} open={todoModal.showEditModal} onCancel={async () => await todoModal.openShowEditModal(false)}>
                {todo.isFetchingSingleData ? (
                    <Spin
                        spinning={todo.isFetchingSingleData}
                        style={{
                            width: "100%",
                            height: "200px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    ></Spin>
                ) : (
                    <Form initialValues={modalInit} id="myFormEdit" onFinish={updateToDo} layout="vertical" form={myFormModal}>
                        <Form.Item
                            name="id"
                            hidden={true}
                            rules={[
                                {
                                    required: true,
                                    message: "ToDo Name is Required!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="ToDo Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "ToDo Name is Required!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="ToDo Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "ToDo Description is Required!",
                                },
                            ]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item name="image">
                            <Upload
                                listType="picture"
                                maxCount={1}
                                defaultFileList={modalInit.image ? [...modalInit.image] : []}
                                beforeUpload={() => {
                                    return false;
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Upload/Change</Button>
                            </Upload>
                        </Form.Item>
                        <Button htmlType="submit" type="primary" block>
                            Update ToDo
                        </Button>
                    </Form>
                )}
            </Modal>
        </Spin>
    );
}

export default inject("todo", "todoModal")(observer(App));
