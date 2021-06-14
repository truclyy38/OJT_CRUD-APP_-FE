
import { useHistory } from "react-router"
import { Button, Card, Input, message, Form  } from "antd"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import Checkbox from "antd/lib/checkbox/Checkbox";
import { useForm } from "antd/lib/form/Form";
import Title from "antd/lib/typography/Title";
import axios from "axios";
import { validRule } from "../../constansts/validRule";
import { useAppDispatch } from "../../hooks/hook";
import { authActions } from "../../store/auth-slice";

/**
 * Login
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
export const Login = (props: any) => {

  const history = useHistory()
  const [form] = useForm()
  const dispatch = useAppDispatch()

  /**
  * submit login form
  * @Param fieldsValue
  */
  const onFinish = (fieldsValue: any) => {
    const user = {
      name: fieldsValue.username,
      password: fieldsValue.password
    }

  axios.post('http://localhost:8080/login', user)
    .then(res => {
      dispatch(authActions.login({
        token: res.data,
        isRemember: form.getFieldValue('remember')
      }))
      history.replace('/honepage')
    }).catch(() => {
      message.error("The username or password invalid! Please check again.");
    })
  }

  return (
    <div id='login-form'>
      <Card style={{ width: '30%', margin: 'auto' }}>
        <Title className="title"
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '30px',
            fontWeight: 400,
          }}
        >
          LOGIN
                </Title>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input  minLength={3} prefix={<UserOutlined className="site-form-item-icon" />} placeholder='Username' autoFocus />
          </Form.Item>
          <Form.Item
          className="passwordField"
            name="password"
            rules={[ {required: true},validRule.password]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              maxLength={25}
            />
          </Form.Item>
            <Form.Item name='remember' valuePropName='checked' style={{textAlign:'left'}}>
              <Checkbox style={{marginLeft:'5px'}}>Remember me</Checkbox>
          </Form.Item>

          <Form.Item  className="passwordField" style={{textAlign:"center"}}>
            <Button htmlType="submit" className="bt-login color-primary" style={{borderRadius:'6px'}}>
              Log in
            </Button>
          </Form.Item>
          <a  style={{marginTop:'5px',marginLeft:"33%"}} className='login-form-forgot' href="/" onClick={(e) => e.preventDefault()}>
            Forgot password
          </a>
        </Form>
      </Card>
    </div>
  )
}
