import { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Layout, Button, Space, Table, Menu, Modal, message } from 'antd';
import { RightOutlined, SearchOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { IMajor } from '../../@types/IMajor';
import { IClasses } from '../../@types/IClasses';
import { deleteClasses, getClasses, getMajors } from '../service/Data';
import { ColumnsType } from 'antd/lib/table';
import useHttp from '../../hooks/use-http';
import { RequestStatus } from '../../constansts/request-status';


let initClass: IClasses[] = []

/**
 * ClassComponent
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
export const ClassComponent = () => {
    let history = useHistory();

    const [classes, setClasses] = useState([] as any);
    const [searchInput, setSearchInput] = useState('' as any);
    const [majors, setMajors] = useState([] as IMajor[]);
    const [flag, setFlag] = useState(true);

    const { confirm } = Modal;
    const { Sider, Content } = Layout;

    // define the request link to delete user
    const {
        sendRequest,
        status,
        data,
        error
    } = useHttp(deleteClasses);

    // set columns table classes
    const columns: ColumnsType<IClasses> = [
        {
            title: 'Class Name',
            dataIndex: 'name',
            key: 'name',
            width: '12%',
            render: (text: String) => <Link to={`/coursebyclass/${text}`} className="title-column" style={{ textDecoration: "underline", fontStyle: "italic" }}> {text}</Link>
        },
        {
            title: 'Current Semester',
            dataIndex: 'semester',
            align: "right",
            render: (semester: number) => <span className="number"> {semester}</span>
        },
        {
            title: 'Total students',
            dataIndex: 'total',
            align: "right",
            render: (total: number) => <span className="number"> {total}</span>
        },

        {
            title: 'Major',
            dataIndex: 'majorid',
            key: 'major',
            filters: majors.map((item) => ({ text: item.name, value: item.id })),
            onFilter: (value: any, record: any) => {
                if (record.majorid === value) {
                    return true;
                }
                return false;
            }
            ,
            render: (majorId: number) => {
                const major = majors.filter((major: IMajor) => (major.id === majorId))

                if (major.length !== 0) {
                    return major[0].name;
                }
                return ''
            }
        },
        {
            title: 'Action',
            key: 'name',
            dataIndex: 'name',
            align: 'center',
            render: (name: string) => (
                <Space size="middle">
                    <Link to={`/registerClass/${name}`}> <button type="button"> Register </button></Link>
                    <button type="button" onClick={handleDelete.bind(null, name)} > 🗑️ </button>
                </Space>
            ),
        },
    ];

    /**
     * delete class by id
     */
    const handleDelete = (name: string) => {
        confirm({
            title: 'You want to delete this class?',
            icon: <ExclamationCircleOutlined />,
            content: 'This data will be delete',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                sendRequest(name);
            },
            onCancel() {
                message.error('Nothing change');
            },
        });
    }

    /**
     * filter class by name
     */
    const filterByName = (searchvalue: any | null) => {
        const filterdClasses = initClass.filter((classes: IClasses) => classes.name.toLowerCase().includes(searchvalue.toLowerCase()))
        setClasses(filterdClasses);
    }

    /**
     * add class
     */
    const addClass = () => {
        history.push("/addNewClass")
    }

    /**
     * useEffect to fetch data
     */
    useEffect(() => {
        getClasses()
            .then((response: any) => {
                initClass = response.data;
                setClasses(initClass);
            });
        getMajors()
            .then((res) => {
                setMajors(res.data)
            })
    }, [flag]);

    /**
    * useEffect to show respone on screen after delete teacher
    * @Param statusDeleteUser
    */
    useEffect(() => {
        if (searchInput == null) setFlag(prevFlag => !prevFlag);
        if (status === RequestStatus.COMPLETED) {
            if (data == null) {
                confirm({
                    title: error,
                    onOk: () => {
                        setFlag(prevFlag => !prevFlag)
                    },
                    onCancel() {
                        message.error('Nothing change');
                    },
                })
            }
            else {
                console.log(data)
                Modal.success({
                    title: data,
                    onOk: () => {
                        history.go(0);
                    }
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    return (
        <Layout id='components-layout-demo-custom-trigger' style={{ minHeight: '100vh' }}>
            <Sider trigger={null} >
                <Menu theme="dark" mode="inline">
                    {/*  defaultSelectedKeys={['2']} */}
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

            <Layout className="site-layout">

                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                </Content>
            </Layout>
            <div className="container">
                <div className="text-center title">
                    CLASSES LIST
                </div>
                <div className="course-button">
                    <Button className="common-button" type="primary" onClick={addClass}>+ Add Class</Button>
                    <div className="search-bar">
                        <input className="form-control form-control-sm" value={searchInput} type="text" id="search" placeholder="Search by name" onChange={(e) => { setSearchInput(e.target.value); filterByName((e.target.value)); }} />
                        <Button className="common-button" type="primary" icon={<SearchOutlined />} >
                            Search
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <Table columns={columns} dataSource={classes} 
                    pagination={{
                        defaultPageSize: 10,
                        showQuickJumper: true,
                        showSizeChanger: true, 
                        pageSizeOptions: ['5', '10', '15'], 
                        size: "small", total: classes.size,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }} />
                </div>
            </div>
        </Layout>
    )
}

