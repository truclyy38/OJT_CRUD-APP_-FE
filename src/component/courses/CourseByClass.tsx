import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Layout, Menu, Table } from "antd";
import { RightOutlined, UserOutlined } from "@ant-design/icons";
import { IClasses } from "../../@types/IClasses";
import { ICourse } from "../../@types/ICourse";
import { getClassByName, getCourseByClass } from "../service/Data";

/**
 * CourseByClass
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
export const CourseByClass = (props: any) => {

  const params: { classname: string } = useParams()
  const [classes, setClasses] = useState<IClasses>();
  const [course, setCourse] = useState<ICourse[]>();

  const { Sider } = Layout;

  // set column table
  const columns = [
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
      // width: '60%',
    },
  ];

  /**
    * useEffect
    * @Param params.classname
    */
  useEffect(() => {

    getClassByName(params.classname)
      .then((res: any) => {

        // set class
        setClasses(res.data);

        // get course by class
        getCourseByClass(res.data.semester, res.data.majorid)
          .then((response) => {
            setCourse(response.data);
          });
      })
  }, [params.classname])

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
      <div className="container">
        <div className="text-center title">
          Course of class {classes?.name} at present
          </div>

        <Table columns={columns} dataSource={course}
         pagination={{
          defaultPageSize: 10, 
          showSizeChanger: true, 
          showQuickJumper: true, 
          pageSizeOptions: ['5', '10', '15'], 
          size: "small", 
          total: course?.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }} />
      </div>
    </Layout>

  );

}