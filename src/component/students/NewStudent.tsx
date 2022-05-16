import { useEffect, useState } from 'react';
import { Layout, Form, Input, Button, Radio, Select, message, Modal, Menu, Space, Upload } from 'antd';
import { ExclamationCircleOutlined, RightOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { IMajor } from '../../@types/IMajor';
import { createUser, getMajors } from '../../component/service/Data';
import { validRule } from '../../constansts/validRule';
import { storage } from '../../firebase';
import { Link } from 'react-router-dom';
import useHttp from '../../hooks/use-http';
import { RequestStatus } from '../../constansts/request-status';

const { Option } = Select;
const { Sider } = Layout;

/**
 * NewStudent
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
export const NewStudent = () => {
  let history = useHistory();
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState('optional');
  const dateFormat = 'YYYY/MM/DD';
  const [majors, setMajors] = useState([]);
  const [file, setFile] = useState<any | null>();

  const { confirm } = Modal;

  // define request to create user
  const { 
    sendRequest, 
    status, 
    data,
     error
    } = useHttp(createUser);

  // set Layout
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };

  /**
  * check file image before upload
  * @Param file
  * @Return boolean
  */
  const props = {
    beforeUpload: (file: any) => {
      if (file) {
        console.log(file);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.warning('You can only upload JPG/PNG file!');
          setFile(null);
          return Upload.LIST_IGNORE
        }
        setFile(file);
        return true;
      }
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
  *  submit new student
  * @Param value
  */
  const handleSubmit = (values: any) => {

    let test = values.fullName;
    let firstname = test.substring(test.lastIndexOf(" ") + 1);
    let acronym = test.match(/\b(\w)/g).join('');
    acronym = acronym.substring(0, acronym.length - 1);

    values.roleId = 3;
    values.majorId = Number(values.majorId);
    values.certificationID = 0;

    values.name = firstname + acronym;
    values.email = values.name;
    values.password = values.name;
    values.dob = values.birthday.format('YYYY-MM-DD');
    const filterdMajors: IMajor[] = majors.filter((mj: IMajor) => mj.id === values.majorId);
    values.studentCode = filterdMajors[0].majorcode;

    if (file) {

      const uploadTask = storage.ref(`/image/${file.name}`).put(file);
      uploadTask.on("state_changed", console.log, console.error, () => {
        storage
          .ref("image")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            values.image = url;
            console.log(values);
            sendRequest(values);
          }
          );
      });
    } else {
      message.warning("Image is required!");
    }
  }

  /**
  * show the add confirm to open the NewStudent Page
  * @Param value
  */
  const showAddConfirm = (value: any) => {
    confirm({
      title: 'You want to add this student?',
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
    history.push("/students");
    message.success('Page reloaded');
  }

  /**
  * Reset
  */
  const Reset = () => {
    message.success("Refresh");
  }

  /**
  * useEffect to show notification
  * @Param status
  */
  useEffect(() => {
    if (status === RequestStatus.COMPLETED) {
      if(data==null){
        confirm({
          title:error,
        })
      }
      else
      confirm({
        title:data,
        content: "Do you want to add more student?" ,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          history.go(0);
        },
        onCancel: ()=> history.push("/students")
      });
    }
    // get majors
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
          <div className="title form-title" style={{ textAlign: 'center' }}> NEW STUDENT </div>
        <Form
         className="form-fields edit-f"
         style={{ minWidth: "45vw" }}
         {...formItemLayout}
         labelAlign="left"
          name="control-hooks"
          form={form}
          layout="horizontal"
          initialValues={{
            requiredMarkValue: requiredMark,
          }}
          onValuesChange={onRequiredTypeChange}
          onFinish={showAddConfirm}
        >
           <Form.Item
              label="Full Name"
              name="fullName"
              colon={false}
              rules={[validRule.fullname]}>
              <Input autoFocus={true} placeholder="Full Name" />
            </Form.Item>

            <Form.Item name="phone"
              label="Phone"
              colon={false}
              rules={[ validRule.phone]}>
              <Input placeholder="Phone" />
            </Form.Item>

            <Form.Item name="majorId"
              label="Major"
              colon={false}
              rules={[validRule.majorid]}>
              <Select style={{ textAlign: "left" }} placeholder="Select the major" >
                {
                  majors.map((item: IMajor) => (
                    <Option style={{ float: 'right' }} value={item.id} key={item.id}>{item.name} </Option>
                  ))
                }
              </Select>
            </Form.Item>

            <Form.Item
              name="gender"
              label=" Gender"
              rules={[validRule.gender]}
              colon={false}>
              <Radio.Group name="gender" defaultValue={1}>
                <Radio value={true} className="font-gender">Male</Radio>
                <Radio value={false} className="font-gender">Female</Radio>
              </Radio.Group>
            </Form.Item>

            {/* <Form.Item
              name="birthday"
              label="Birthday"
              colon={false}
              rules={[validRule.birthday]} >
                <DatePicker format={dateFormat} disabledDate={(date) => !date || date.isSameOrAfter(new Date())
                } />
              </Form.Item> */}

              <Form.Item
              name="image"
              label="Image"
              colon={false}
            >
                <Upload {...props}>
                  <Button style={{ alignItems: "right" }} icon={<UploadOutlined />}>Upload file</Button>
                </Upload>
              </Form.Item>

            <Form.Item wrapperCol={{
              xs: { span: 24, offset: 9 },
              sm: { span: 16, offset: 5 },
            }}
            className="button-form ">
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
