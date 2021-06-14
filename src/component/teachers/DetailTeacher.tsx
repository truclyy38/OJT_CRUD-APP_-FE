import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { IUser } from '../../@types/IUser';
import { Link } from 'react-router-dom';

import {Layout, Menu } from 'antd';
import { RightOutlined, UserOutlined } from '@ant-design/icons';

import { getCertificationByID, getMajorByID, getUserByName } from '../service/Data';
import { IMajor } from '../../@types/IMajor';
import { ICertification } from '../../@types/ICertification';

const { Sider, Content } = Layout;

/**
 * DetailTeacher
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
export const DetailTeacher = (props: any) => {
    const params: { name: string } = useParams()

    const [teacher, setTeacher] = useState({} as IUser);
    const [majorTc, setMajorTc] = useState({} as IMajor);
    const [certi, setCerti] = useState({} as ICertification);

    /**
    * useEffect
    * @Param params.name
    */
    useEffect(() => {
        getUserByName(params.name)
            .then(
                (res: any) => {
                  console.log(res.data);
                    getMajorByID(res.data.majorId)
                        .then((resMajor: any) => {
                            setMajorTc(resMajor.data);
                        });
                    getCertificationByID(res.data.certificationID)
                    .then((resCerti:any)=>{
                      setCerti(resCerti.data)
                    })
                    setTeacher(res.data);         
                }
            )
    }, [params.name])

    return (
        <Layout id='components-layout-demo-custom-trigger' style={{ minHeight: '100vh' }}>
      <Sider trigger={null} >
        <div className="logo" />
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
              <div className="col-12 title">TEACHER DETAIL</div>
              <div className="row">
                <div className="col-xl-4 col-6">
                    <img src={teacher.image} alt="studentAvatar" className="img-thumbnail" style={{width:'300px', height:'320px'}}/>
                </div>
                <div className="col-xl-8 col-6">
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Username </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control non-cursor" value={teacher.name} disabled/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Full Name </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={teacher.fullName}/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Birthday </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={teacher.dob}/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Gender </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={teacher.gender?"Male":"Female"}/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Phone </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={teacher.phone}/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Email </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={teacher.email}/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form mt-2">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Major </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" value={majorTc.name}/>
                        </div>
                    </div>
                    <div className="form-group row bold text-left-form">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Certification </label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control non-cursor" value={certi.name}/>
                        </div>
                    </div>
                </div>
              </div>
          </div>
    </Layout>



    )
}