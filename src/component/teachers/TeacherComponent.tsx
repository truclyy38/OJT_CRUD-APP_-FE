import { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom";
import { Layout, Table, Space, Button, message, Modal, Menu } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, RightOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';

import { getMajors, deleteUser, checkExistUser, getCertification, getTeachers } from '../../component/service/Data';
import { IUser } from '../../@types/IUser';
import { IMajor } from '../../@types/IMajor';
import useHttp from '../../hooks/use-http';
import { RequestStatus } from '../../constansts/request-status';
import { ICertification } from '../../@types/ICertification';

let initTeachers: IUser[] = [];

/**
 * TeacherComponent
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
export const TeacherComponent = (props: any) => {

  let history = useHistory();

  const [teachers, setTeachers] = useState<IUser[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [flag, setFlag] = useState(true);
  const [majors, setMajors] = useState<IMajor[]>([]);
  const [certifications, setCertifications] = useState<ICertification[]>([]);

  const { confirm } = Modal;
  const { Sider, Content } = Layout;

  // define the request link to delete user
  const {
    sendRequest: requestDeleteUser,
    status: statusDeleteUser,
    data: dataDeleteUser,
    error: ErrorDeleteUser
  } = useHttp(deleteUser);

  // define the reuquest to check exist user
  const {
    sendRequest: requestCheckUser,
    status: statusCheckUser,
  } = useHttp(checkExistUser)

  /**
  * column table define
  */
  const columns: ColumnsType<IUser> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '12%',
      sorter: {
        compare: (a: any, b: any) => { return a.name.localeCompare(b.name) },
        multiple: 1,
      },
      render: (text: string) => <span style={{ alignItems: 'left', textDecoration: "underline", fontStyle: "italic" }} >
        <Link className="title-column" to={`/detailteacher/${text}`}> {text}</Link>
      </span>,
    },

    {
      title: 'Major',
      dataIndex: 'majorId',
      width: '25%',
      key: 'major',
      filters: majors.map((item) => ({ text: item.name, value: item.id })),
      onFilter: (value: any, record: any) => {
        if (record.majorId === value) return true;
        return false;
      },

      render: (majorId: number) => {
        const major = majors.filter((major: IMajor) => (major.id === majorId))

        if (major.length !== 0) {
          return major[0].name;
        }
        return ''
      }
    },

    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },

    {
      title: 'Phone',
      dataIndex: 'phone',
    },

    {
      title: 'Certification',
      dataIndex: 'certificationID',
      key: 'certification',
      filters: certifications.map((item) => ({ text: item.name, value: item.id })),
      onFilter: (value: any, record: any) => {
        if (record.certificationID === value) return true;
        return false;
      }
      ,
      render: (Id: number) => {
        const certification = certifications.filter((certification: ICertification) => (certification.id === Id))

        if (certification.length !== 0) {
          return certification[0].name;
        }
        return ''
      }
    },

    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (id: number) => (
        <Space size="middle">
          <button type="button" className="bt-item" onClick={showEditConfirm.bind(null, id)}><EditOutlined /></button>
          <button type="button" className="bt-item" onClick={showDeleteConfirm.bind(null, id)}> <DeleteOutlined /> </button>
        </Space>
      ),
    },
  ];

  // ------  function ------ //

  /**
  * add new teacher
  */
  const addTeacher = () => {
    history.push("/addnewteacher");
  }

  /**
  * filter user by name
  * @Param searchvalue
  */
  const filterByFullName = (searchvalue: any | null) => {
    const filterdTeachers = initTeachers.filter((teacher: IUser) => teacher.fullName.toLowerCase().includes(searchvalue.toLowerCase()))
    setTeachers(filterdTeachers);
  }

  /**
  * show the delete confirm when click on the delete button
  * @Param id
  */
  function showDeleteConfirm(id: number) {
    confirm({
      title: 'You want to delete this teacher?',
      icon: <ExclamationCircleOutlined />,
      content: 'This data will be delete',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        message.error('Nothing change');
      },
    });
  }

  /**
  *  show the edit confirm
  * @Param id
  */
  const showEditConfirm = (id: any) => {
    requestCheckUser(id);
    if (statusCheckUser === RequestStatus.COMPLETED) {
      history.push(`/editteacher/${id}`);
    } else {
      confirm({
        title: "Someone else deleted this data, reload page?",
        okText:"Yes",
        cancelText: "No",
        onOk: () => {
          setFlag(prevFlag => !prevFlag)
        },
      })
    }
  }

  /**
  *  request delete user
  * @Param id
  */
  const handleDelete = (id: number) => {
    requestDeleteUser(id);
  }

  /**
    * useEffect to fetch data
    * @Param flag
    */
  useEffect(() => {

    // get teachers
    getTeachers()
      .then((res: any) => {
        initTeachers = res.data;
        setTeachers(initTeachers);
      });

    //get majors
    getMajors()
      .then((res) => {
        setMajors(res.data)
      });

    // get certification
    getCertification()
      .then((res) => {
        setCertifications(res.data)
      });

  }, [flag])

  /**
  * useEffect to show respone on screen after delete teacher
  * @Param statusDeleteUser
  */
  useEffect(() => {
    if (searchInput == null) setFlag(prevFlag => !prevFlag);
    if (statusDeleteUser === RequestStatus.COMPLETED) {
      if (dataDeleteUser == null) {
        confirm({
          title: ErrorDeleteUser,
          onOk: () => {
            setFlag(prevFlag => !prevFlag)
          },
          onCancel() {
            message.error('Nothing change');
          },
        })
      }
      else
        Modal.success({
          title: dataDeleteUser,
          onOk: () => {
            history.go(0);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusDeleteUser])

  return (
    <Layout id='components-layout-demo-custom-trigger' style={{ minHeight: '100vh' }}>

      <Sider trigger={null} >
        <Menu theme="dark" mode="inline" >
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

      <Content>
        <div className="container">
          <div className="text-center title">
            TEACHER LIST
          </div>
          <div className="course-button">
            <Button onClick={addTeacher} type="primary" className="common-button" style={{ borderRadius: '5px!important' }}> + Add teacher</Button>
            <div className="search-bar">
              <input className="form-control form-control-sm" value={searchInput} type="text" id="search" placeholder="Search by full name" onChange={(e) => { setSearchInput(e.target.value); filterByFullName(e.target.value); }} />
              <Button type="primary" className="common-button" icon={<SearchOutlined />}>
                Search
              </Button>
            </div>
          </div>
          <Table columns={columns} dataSource={teachers.reverse()} scroll={{ y: 350 }}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15'], size: "small",
              total: teachers.length,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }} />
        </div>
      </Content>
    </Layout>
  );
}