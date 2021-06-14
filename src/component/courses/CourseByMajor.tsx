import { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import axios from 'axios'
import { RightOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Table, Button, Menu, message } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { IMajor } from '../../@types/IMajor'
import { ICourse } from '../../@types/ICourse'
import { getCourse, getMajors } from '../service/Data'



const { Sider, Content } = Layout;

/**
 * CourseByMajor
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
export const CourseByMajor = () => {
  let history = useHistory();

  const [course, setCourse] = useState([]);
  const [searchInput, setSearchInput] = useState(0);
  const [majors, setMajors] = useState<IMajor[]>([]);
  const API_COURSE_BY_SEMESTER = String("http://localhost:8080/api/course/semester/" + searchInput);

  // set columns table
  const columns: ColumnsType<ICourse> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a: any, b: any) => { return a.name.localeCompare(b.name) },
        multiple: 1,
      },
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },

    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      align: "right",
      render: (semester: number) => <span style={{ textAlign: "right" }}>{semester}</span>,
      sorter: {
        compare: (a: any, b: any) => a.semester - b.semester,
        multiple: 2,
      },

    },
    {
      title: 'Major',
      dataIndex: 'majorid',
      key: 'major',
      filters: majors.map((item) => ({ text: item.name, value: item.id })),
      onFilter: (value: any, record: any) => {
        if (record.majorid === value) return true;
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
  ];

  /**
   * filter course by semester
   */
  const filterBySemester = (searchInput: any) => {
    const reg = /^[0-9\b]+$/;
    if (searchInput === 0 || searchInput === '') {
      // get courses
      getCourse()
        .then((response) => {
          setCourse(response.data);
        });
    }
    else if (reg.test(searchInput)) {
      axios.get(API_COURSE_BY_SEMESTER)
        .then((response) => {
          setCourse(response.data);
        });
    }
    else
      message.error("The semester is invalid!");
  }

  /**
   * add course
   */
  const addCourse = () => {
    history.push("/addCourse");
  }

  /**
  * useEffect
  */
  useEffect(() => {
    async function axiousAPI() {
      // get course
      getCourse()
        .then((response) => {
          setCourse(response.data);
        });

      // get major
      getMajors()
        .then((res) => {
          setMajors(res.data)
        })
    }

    axiousAPI();
  }, [])

  return (
    <Layout id='components-layout-demo-custom-trigger' style={{ minHeight: '100vh' }}>
      <Sider trigger={null} >
        <div className="logo" />
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
          COURSE BY MAJOR
        </div>
        <div className="course-button">
          <Button className="common-button" onClick={addCourse} type="primary">+ Add course</Button>
          <div className="search-bar">
            <input className="form-control form-control-sm" value={searchInput} type="text" id="search" placeholder="Search by semester" onChange={(e) => { setSearchInput(Number(e.target.value)) }} />
            <Button className="common-button" type="primary" icon={<SearchOutlined />} onClick={() => { filterBySemester((searchInput)) }}>
              Search
            </Button>
          </div>

        </div>

        <div className="row">
          <Table columns={columns} dataSource={course} 
          pagination={{
            defaultPageSize: 10,
            showQuickJumper: true, 
            showSizeChanger: true, 
            pageSizeOptions: ['5', '10', '15'], 
            size: "small", 
            total: course.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }} />
        </div>
      </div>
    </Layout>

  );

}
// course by major
// class by course