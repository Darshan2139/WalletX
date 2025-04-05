import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import mwalletLogo from '../mwallet.png';

const Login = ({ setIsAuthenticated }) => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    // Check if user already exists
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['walletPassword'], (result) => {
        if (result.walletPassword) {
          setIsNewUser(false);
        }
      });
    } else {
      const storedPassword = localStorage.getItem('walletPassword');
      if (storedPassword) {
        setIsNewUser(false);
      }
    }
  }, []);

  const storePassword = (password) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set({ 
          walletPassword: password,
          isNewUser: false 
        }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } else {
      localStorage.setItem('walletPassword', password);
      localStorage.setItem('isNewUser', 'false');
      return Promise.resolve();
    }
  };

  const verifyPassword = (password) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['walletPassword'], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result.walletPassword === password);
          }
        });
      });
    } else {
      const storedPassword = localStorage.getItem('walletPassword');
      return Promise.resolve(storedPassword === password);
    }
  };

  const onFinish = async (values) => {
    try {
      if (isNewUser) {
        if (values.password !== values.confirmPassword) {
          message.error('Passwords do not match!');
          return;
        }
        await storePassword(values.password);
        message.success('Password created successfully!');
        setIsAuthenticated(true);
        navigate('/');
      } else {
        const isValid = await verifyPassword(values.password);
        if (isValid) {
          setIsAuthenticated(true);
          navigate('/');
        } else {
          message.error('Incorrect password!');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(!passwordVisible);
    } else {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img 
          src={mwalletLogo} 
          alt="WalletX Logo" 
          className="mwalletLogo"
        />
        <h2>{isNewUser ? 'Create Password' : 'Login'}</h2>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
          >
            <div className="password-input-wrapper">
              <Input.Password 
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: () => togglePasswordVisibility('password'),
                }}
                iconRender={(visible) => (
                  <div 
                    className="password-toggle-icon"
                    onClick={() => togglePasswordVisibility('password')}
                  >
                    {visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                  </div>
                )}
              />
            </div>
          </Form.Item>

          {isNewUser && (
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <div className="password-input-wrapper">
                <Input.Password 
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Confirm Password"
                  visibilityToggle={{
                    visible: confirmPasswordVisible,
                    onVisibleChange: () => togglePasswordVisibility('confirm'),
                  }}
                  iconRender={(visible) => (
                    <div 
                      className="password-toggle-icon"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                    </div>
                  )}
                />
              </div>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isNewUser ? 'Create Password' : 'Login'}
            </Button>
          </Form.Item>

          {!isNewUser && (
            <Button 
              type="link" 
              onClick={() => {
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                  chrome.storage.local.clear(() => {
                    setIsNewUser(true);
                    form.resetFields();
                    message.success('Password reset initiated. Create a new password.');
                  });
                } else {
                  localStorage.clear();
                  setIsNewUser(true);
                  form.resetFields();
                  message.success('Password reset initiated. Create a new password.');
                }
              }}
              block
            >
              Reset Password
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Login; 