import { useEffect, useState } from 'react';
import { useParams,useHistory } from "react-router";
import { Link } from 'react-router-dom';
import { Layout, Form, Button, message, Modal, Menu, Space, Row, Col, Input } from 'antd';
import { ExclamationCircleOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import { checkExistStudentByCode, getClassByName, getUserByStudentCode, registerStudent } from '../../component/service/Data';
import { validRule } from '../../constansts/validRule';
import { RequestStatus } from "../../constansts/request-status";
import { IClasses } from "../../@types/IClasses";
import useHttp from "../../hooks/use-http";

const { Sider } = Layout;

// set tail layout
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

/**
 * RegisterClass
 *
 * Version 1.0
 *
 * Date: 06-10-2021
 *
 * Copyright
 *
 * Modification Logs:
 * DATE                 AUTHOR          DESCRIPTION
 * -----------------------------------------------------------------------
 * 06-10-2021	         LyNTT9           Create
 */
export const RegisterClass = (props: any) => {
    let history = useHistory();

    const params: { name: string } = useParams();
    const [form] = Form.useForm();
    const [requiredMark, setRequiredMarkType] = useState('optional');
    const [studentCode, setStudentCode] = useState<any>();
    const [classes, setClasses] = useState<IClasses>();

    const { confirm } = Modal;

    // define request to register student
    const {
        sendRequest: requestEnroll,
        status: statusEnroll,
        data: dataEnroll,
        error: errorEnrol,
    } = useHttp(registerStudent);

    // define request to check exist student
    const {
        sendRequest: requestCheckUser,
        status: statusCheckUser,
        data: dataCheckUser,
        error: errorCheckUser
    } = useHttp(checkExistStudentByCode);

    /**
     *  set requiremarker when form change
     * @Param requiredMarkValue
     */
    const onRequiredTypeChange = (requiredMarkValue: any) => {
        setRequiredMarkType(requiredMarkValue);
    };

    /**
     *  submit register student
     * @Param value
     */
    const handleSubmit = (values: any) => {
        values.classId = classes?.id;
        setStudentCode(values.studentCode);
        requestCheckUser(values.studentCode);
    }

    /**
     * show the add confirm to register student
     * @Param value
     */
    function showAddConfirm(value: any) {
        confirm({
            title: 'You will create a register',
            icon: <ExclamationCircleOutlined />,
            content: 'This record will be added',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleSubmit(value);
            },
            onCancel() {
                message.error('Nothing change');
            },
        });
    }

    /**
     * Cancel
     */
    const Cancel = () => {
        history.push("/classes");
    }

     /**
     * useEffect to check statusEnroll
     * @Param statusEnroll
     */
    useEffect(() => {
        if (statusEnroll === RequestStatus.COMPLETED) {
            if (dataEnroll == null) {
                confirm({
                    title: "Fail!",
                    content: errorEnrol,
                })
            }
            else {
                confirm({
                    title: dataEnroll,
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: () => {
                        history.push('/classes');
                    },
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusEnroll])

    /**
     * useEffect to check if exist student -> register
     * @Param statusEnroll
     */
    useEffect(() => {
        if (statusCheckUser === RequestStatus.COMPLETED) {
            if (dataCheckUser == null) {
                confirm({
                    title: errorCheckUser,
                    content: "Please check your student code again!",
                })
            }
            else {
                let register = {}
                getUserByStudentCode(studentCode)
                    .then((res: any) => {
                        console.log(res.data);
                        register = {
                            userId: res.data.id,
                            classId: classes?.id,
                        }
                    })
                confirm({
                    title: "You sure to enrol?",
                    onOk: () => {
                        requestEnroll(register);
                    },
                    onCancel: () => history.go(0),
                });
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusCheckUser]);

    /**
     * useEffect to get class by name
     * @Param params.name
     */
    useEffect(() => {
        getClassByName(params.name)
            .then(res => setClasses(res.data));
    }, [params.name]);

    return (
        <div>
            <Layout id='components-layout-demo-custom-trigger' style={{ minHeight: '100vh' }}>
                <Sider trigger={null} >
                    <Menu theme="dark" mode="inline">
                        <Menu.Item key="1" icon={<UserOutlined />}>
                            Account
                        </Menu.Item>
                        <Menu.Item key="2" icon={<RightOutlined />}>
                            <Link to={`/students`}>Students Information </Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<RightOutlined />}>
                            <Link to={`/teachers`}>Teachers Information </Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<RightOutlined />}>
                            <Link to={`/classes`}>Classes Information </Link>
                        </Menu.Item>
                        <Menu.Item key="5" icon={<RightOutlined />}>
                            <Link to={`/courses`}>Course Information </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Space className="contain-f" direction="horizontal">
                    <div className="edit-f-contain">
                        <div className="title form-title" style={{ textAlign: "center" }}> CREATE REGISTER </div>
                        <Form className="form-fields " {...tailLayout} name="control-hooks"
                            form={form}
                            layout="horizontal"
                            initialValues={{
                                requiredMarkValue: requiredMark,
                            }}
                            onValuesChange={onRequiredTypeChange}
                            onFinish={showAddConfirm}
                        >
                            <Row gutter={24} style={{ width: "400px" }}>
                                <Col span={8} className="label-f"> Class Name</Col>
                                <Col span={16} style={{ alignItems: "left" }}>
                                    <Form.Item>
                                        {params.name}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24} style={{ width: "400px" }}>
                                <Col span={8} className="label-f"> StudentCode</Col>
                                <Col span={16} style={{ alignItems: "left" }}>
                                    <Form.Item
                                        name="studentCode"
                                        className="input-f"
                                        rules={[{ required: true }, validRule.studentCode
                                        ]}
                                    >
                                        <Input placeholder="Student Code" maxLength={10} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item className="button-form " labelAlign="left">
                                <Button className="bt-cancel common-button" onClick={Cancel} htmlType="reset">Cancel</Button>
                                <Button className=" but bt-submit common-button" htmlType="submit" >Submit</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Space>
            </Layout>
        </div>)
}