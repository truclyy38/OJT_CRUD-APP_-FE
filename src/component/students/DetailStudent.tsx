import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { IUser } from '../../@types/IUser';

import { TOKEN } from '../../constansts/token';
import { getMajorByID } from '../service/Data';
import { IMajor } from '../../@types/IMajor';
import {Layout, Menu } from 'antd';
import { RightOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Sider, Content } = Layout;

/**
 * auth.service
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

 /**
    * login
    * @Param username, password
    * @Return token
    */
export const DetailStudent = (props: any) => {
    const params: { name: string } = useParams()

    const [student, setStudent] = useState({} as IUser);
    const [majorStd, setMajorstd] = useState({} as IMajor);
    const [majorid] = useState() as any;

    /**
    * useEffect
    * @Param majorid, params.name
    */
    useEffect(() => {
        axios.get(`http://localhost:8080/api/user/name/${params.name}`, {
            headers: {
                'Authorization': `${TOKEN}`,
                'Content-Type': 'application/json'
            }
        })
            .then(
                (res: any) => {
                    getMajorByID(res.data.majorId)
                        .then((res2: any) => {
                            setMajorstd(res2.data);
                        })
                    setStudent(res.data);
                }
            )
    }, [majorid, params.name])

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

          <div className="container-fluid ml-3">
              <div className="col-12 title">STUDENT DETAIL</div>
              <div className="row">
                <div className="col-xl-4 col-6">
                    <img src={student.image} alt="studentAvatar" className="img-thumbnail" style={{width:'300px', height:'320px'}}/>
                </div>
                <div className="col-xl-8 col-6">
                    <div className="form-group row bold text-left-form">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">MSSV </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control non-cursor" value={student.studentCode} disabled/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Username </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control non-cursor" value={student.name} disabled/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Full Name </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={student.fullName}/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Birthday </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={student.dob}/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Gender </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={student.gender?"Male":"Female"}/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Phone </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={student.phone}/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Email </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={student.email}/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Major </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={majorStd.name}/>
                        </div>
                    </div>
                </div>
              </div>
          </div>
    </Layout>



    )
}