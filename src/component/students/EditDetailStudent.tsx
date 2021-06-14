import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Layout, DatePicker, Input, Form, Button, Radio, Popconfirm, message, Select, Modal, Menu, Upload, Space } from "antd";
import { ExclamationCircleOutlined, RightOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import moment from 'moment';
import { IMajor } from "../../@types/IMajor";
import { IUser } from "../../@types/IUser";
import { storage } from "../../firebase";
import useHttp from "../../hooks/use-http";
import { validRule } from "../../constansts/validRule";
import { RequestStatus } from "../../constansts/request-status";
import { editUserById, getMajors, getUserByID } from "../service/Data";


const { Option } = Select;
let studentInput: IUser;

/**
 * EditDetailStudent
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
export const EditDetailStudent = (props: any) => {

  let history = useHistory();
  const params: { studentId: string } = useParams();
  const [majors, setMajors] = useState([]);
  const [file, setFile] = useState<any | null>();
  const [imageUrl, setImageUrl] = useState<any | null>();
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState('optional');
  const dateFormat = 'YYYY/MM/DD';

  const { confirm } = Modal;
  const { Sider } = Layout;
  const {
    sendRequest,
    status,
    data,
    error
  } = useHttp(editUserById);

  /**
    * check image before upload
    * @Param file
    * @Return boolean
    */
  const img = {
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

  // set Layout
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };

  /**
   * show update confirmation when submit form
   * @Param value:IUser
   */
  function showConfirmation(value: any) {
    confirm({
      title: 'Are you sure update this student?',
      icon: <ExclamationCircleOutlined />,
      content: 'The data can be changed',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        // call submit function
        submitChange(value);
      },
      onCancel() {
        message.error('Nothing change');
      },
    });
  }

  /**
   * handle values submit and send to api
   * @Param fieldValues
   */
  const submitChange = (fieldValues: any) => {

    // initial fullName value, trim the space
    fieldValues.fullName = fieldValues.fullName.trim();

    let test = fieldValues.fullName;
    let firstname = test.substring(test.lastIndexOf(" ") + 1);
    let acronym = test.match(/\b(\w)/g).join('');

    //get the first letter of full name
    acronym = acronym.substring(0, acronym.length - 1);

    // change date of birth in datetime to string type
    fieldValues.dob = fieldValues.birthday.format('YYYY-MM-DD');

    // set temp username, email before put to backend handle
    fieldValues.name = firstname + acronym;
    fieldValues.email = fieldValues.name + "@gmail.com";
    fieldValues.id = params.studentId;

    // keep the studentCode not change
    fieldValues.studentCode = studentInput.studentCode;

    // status=true mean this data exist
    fieldValues.status = true;

    // if user don't input the password, it default to the initial value
    if (fieldValues.password === '') {
      fieldValues.password = studentInput.password;
    }

    // check exist file image, if update new img, it will be posted to the firebase and return url link
    if (!file) {
      fieldValues.image = imageUrl;
      sendRequest(fieldValues);
    }
    else {
      const uploadTask = storage.ref(`/image/${file.name}`).put(file);
      uploadTask.on("state_changed", console.log, console.error, () => {
        storage
          .ref("image")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            fieldValues.image = url;
            sendRequest(fieldValues);
          });
      });
    }
  }

  /**
   *  set requiremarker when form change
   * @Param requiredMarkValue
   */
  const onRequiredTypeChange = (requiredMarkValue: any) => {
    setRequiredMarkType(requiredMarkValue);
  };

  /**
   * confirm cancel
   */
  const confirmCancel = () => {
    history.push("/students");
    message.success('Page reloaded');
  }

  /**
   * confirm cancel
   */
  const cancel = () => {
    message.error('Stay at this page');
  }

  /**
    * useEffect
    * @Param form, params.studentId, status
    */
  useEffect(() => {
    if (status === RequestStatus.COMPLETED) {
      if (data == null) {
        Modal.error({
          title: error,
          content: "Do you want to reload page?",
        })
      }
      else
        confirm({
          title: data,
          content: "Do you want to back student page?",
          onOk: () => {
            history.push('/students');
          }
        });
    }

    //get majors from db
    getMajors()
      .then((res) => {
        setMajors(res.data)
      })

    // get user by param id
    getUserByID(params.studentId)
      .then((response: any) => {
        const studentData = { ...response.data, birthday: moment(response.data.dob) }
        studentData.password = "";
        form.setFieldsValue(studentData);
        setImageUrl(response.data.image);
        studentInput = response.data;
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, params.studentId, status])


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
          <div className="title form-title" style={{ textAlign: 'center' }}> EDIT STUDENT </div>

          <Form
            className="form-fields edit-f"
            style={{ minWidth: "45vw" }}
            labelAlign="left"
            name="nest-messages"
            onFinish={(value: any) => { showConfirmation(value) }}
            initialValues={{
              requiredMarkValue: requiredMark,
            }}
            {...formItemLayout}
            onValuesChange={onRequiredTypeChange}
            form={form}
          >
            <Form.Item
              label="Full Name"
              name="fullName"
              colon={false}
              rules={[ validRule.fullname]}>
              <Input autoFocus={true} placeholder="Full Name" />
            </Form.Item>

            <Form.Item name="phone"
              label="Phone"
              colon={false}
              rules={[ validRule.phone ]}>
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
              colon={false}>
              <Radio.Group name="gender" defaultValue={1}>
                <Radio value={true} className="font-gender">Male</Radio>
                <Radio value={false} className="font-gender">Female</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="birthday"
              label="Birthday"
              colon={false}
              rules={[validRule.birthday]} >
              <DatePicker defaultValue={moment('2021/05/24', dateFormat)} format={dateFormat} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              colon={false}
              rules={[validRule.password]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm password"
              name="confirm"
              colon={false}
              dependencies={['password']}
              rules={[
                validRule.password,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="image"
              label="Image"
              colon={false}
            >
              <Upload {...img}>
                <Button icon={<UploadOutlined />}>Upload image</Button>
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 5 },
            }}>
              <Popconfirm
                title="All the data changed would not save!"
                onConfirm={confirmCancel}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" className="bt-cancel" style={{ marginRight: '25px' }} >Cancel</Button>
              </Popconfirm>
              <Button type="primary" htmlType="submit" >Update</Button>
            </Form.Item>
          </Form>
        </div>
      </Space>
    </Layout>
  );
}