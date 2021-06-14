import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Layout, Form, Input, Button, Select, message, Modal, Menu, Space } from 'antd'
import { ExclamationCircleOutlined, RightOutlined, UserOutlined } from '@ant-design/icons'
import { IMajor } from '../../@types/IMajor'
import { createClass, getMajors } from '../../component/service/Data'
import { validRule } from '../../constansts/validRule'
import { RequestStatus } from '../../constansts/request-status'
import useHttp from '../../hooks/use-http'

const { Option } = Select;
const { Sider } = Layout;

/**
 * NewClass
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
export const NewClass = () => {
  let history = useHistory();

  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState('optional');
  const [majors, setMajors] = useState([]);

  const { confirm } = Modal;

  // define request to create class
  const {
    sendRequest,
    status,
    data,
    error
  } = useHttp(createClass)


  // set Layout
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };

  /**
  *  set requiremarker when form change
  * @Param requiredMarkValue
  */
  const onRequiredTypeChange = (requiredMarkValue: any) => {
    setRequiredMarkType(requiredMarkValue);
  };

  /**
  *  submit new class
  * @Param value
  */
  const handleSubmit = (values: any) => {

    sendRequest(values);
  }

  /**
  * show the add confirm to open the NewClass Page
  * @Param value
  */
  function showAddConfirm(value: any) {
    confirm({
      title: 'You want to add this class?',
      icon: <ExclamationCircleOutlined />,
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
    message.success('Page reloaded');
  }

  /**
  * Reset
  */
  const Reset = () => {
    message.success("Refresh");
  }

  /**
  * useEffect to fetch data
  * @Param major
  */
  useEffect(() => {
    // get major
    getMajors()
      .then((res: any) => {
        setMajors(res.data);
      })
  }, [majors]);

  /**
  * useEffect to show notification
  * @Param status
  */
  useEffect(() => {
    if (status === RequestStatus.COMPLETED) {
      if (data == null) {
        confirm({
          title: error,
        })
      }
      else
        confirm({
          title: data,
          content: "Add more class?",
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: () => {
            history.go(0);
          },
          onCancel: ()=>{
            history.push('/classes');
          }
        });
    }
    getMajors()
      .then((res: any) => {
        setMajors(res.data);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
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
          <div className="title form-title" style={{ textAlign: "center"}}> NEW CLASS </div>
          <Form className="form-fields edit-f" name="control-hooks"
            form={form}
            labelAlign="left"
            {...formItemLayout}
            layout="horizontal"
            initialValues={{
              requiredMarkValue: requiredMark,
            }}
            onValuesChange={onRequiredTypeChange}
            onFinish={showAddConfirm}
          >
            <Form.Item
              label=" Class Name"
              name="name"
              colon={false}
              rules={[ validRule.classname]}>
              <Input autoFocus={true} placeholder="Class name" maxLength={20} />
            </Form.Item>

            <Form.Item
              label="Max num student"
              name="total"
              colon={false}
              required
              rules={[ validRule.numbertotal]}>
              <Input placeholder="Total" />
            </Form.Item>

            <Form.Item
              label=" Semester"
              name="semester"
              colon={false}
              rules={[validRule.semester]}>
              <Input placeholder="Semester" />
            </Form.Item>

            <Form.Item
              label="Major"
              name="majorid"
              colon={false}
              rules={[validRule.majorid]}>
              <Select style={{ textAlign: "left" }} placeholder="Select the major">
                {
                  majors.map((item: IMajor) => (
                    <Option value={item.id} key={item.id}>{item.name} </Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              className="button-form">
              <Button className="bt-cancel common-button but" onClick={Cancel} htmlType="reset">Cancel</Button>
              <Button className="bt-reset common-button but" onClick={Reset} htmlType="reset">Refresh</Button>
              <Button className=" but bt-submit common-button" htmlType="submit" >Submit</Button>
            </Form.Item>
          </Form>
        </div>
      </Space>
    </Layout>
  );
};
