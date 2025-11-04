// src/pages/Register.tsx
import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/auth";
import { useAuthStore } from "../store/auth";

const { Title, Paragraph } = Typography;

const iconUrl = "/src/assets/icon.png";
const illustrationUrl = "/src/assets/login-illustration.png";
const fallbackIllustration = "https://i.imgur.com/4AiXzf8.png";
const fallbackIcon = "https://i.imgur.com/7kJQ8hE.png";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Lấy và trim input
      const fullname = (values.fullname || "").trim();
      const username = (values.username || "").trim(); 
      const password = values.password;

      
      await registerApi(fullname, username, password);

      if (authStore?.register) authStore.register();

      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Đăng ký thất bại, vui lòng thử lại";
      console.error("Register error:", err);
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-root">
      <style>{`
        :root {
          --bg: #f6f6f8;
          --card: #ffffff;
          --muted: #6b6b6b;
        }
        .page-root{
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:var(--bg);
          padding:48px 24px;
          box-sizing:border-box;
        }
        .wrap { width:100%; max-width:1200px; }
        .panel {
          display:flex;
          background:var(--card);
          border-radius:10px;
          overflow:hidden;
          box-shadow: 0 10px 30px rgba(2,6,23,0.06);
          align-items:stretch;
        }
        .left {
          width:48%;
          min-width:360px;
          padding:28px 36px;
          background: linear-gradient(180deg,#f7f7f7,#efefef);
          box-sizing:border-box;
          display:flex;
          flex-direction:column;
          justify-content:flex-start;
        }
        .brand {
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:10px;
        }
        .brand-icon {
          width:44px;
          height:44px;
          border-radius:10px;
          overflow:hidden;
          display:inline-block;
          background: #fff;
          border: 1px solid rgba(2,6,23,0.06);
          box-shadow: 0 2px 6px rgba(2,6,23,0.04);
          flex: 0 0 44px;
        }
        .brand-icon img {
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
        }
        .brand-info {
          display:flex;
          flex-direction:column;
          line-height:1;
        }
        .brand-title {
          font-weight:700;
          color:#111;
          font-size:14px;
          margin-bottom:4px;
        }
        .brand-sub {
          color:var(--muted);
          font-size:13px;
          margin-top:6px;
        }
        .title { margin:8px 0 6px; font-weight:700; }
        .desc {
          font-size: 13px;
          color: var(--muted);
          margin-top: 20px;
          margin-bottom: 18px;
          line-height: 1.6;
        }
        .form-box { width:100%; }
        .label-star { color: #ff4d4f; margin-right:4px; font-weight:700; }
        .ant-form-item-label > label { font-weight:600; color:#222; }
        .ant-input-affix-wrapper, .ant-input, .ant-input-password { border-radius:16px; }
        .ant-form-item { margin-bottom:14px; }
        .btn-login {
          background:#000;
          border: none;
          color: #fff;
          border-radius:8px;
          height:44px;
          font-weight:600;
          transition: all 0.25s ease;
        }
        .btn-login:hover {
          background:#1677ff;
          color:#fff;
        }
        .actions-row { display:flex; justify-content:center; align-items:center; margin-top:8px; gap:6px; }
        .link-muted { color:#1677ff; text-decoration: none; cursor:pointer; }
        .right {
          width:52%;
          display:flex;
          align-items:center;
          justify-content:center;
          background: #fff;
          padding:20px;
          box-sizing:border-box;
        }
        .illustration {
          width:92%;
          max-height:420px;
          object-fit:contain;
          border-radius:6px;
        }
        @media (max-width:920px){
          .panel{ flex-direction:column; }
          .left, .right { width:100%; }
          .left { padding:20px; }
          .illustration { width:100%; max-height:300px; }
        }
        .outer-pad { padding: 36px; background: rgba(250,250,252,1); border-radius: 10px; }
      `}</style>

      <div className="wrap">
        <div className="outer-pad">
          <div className="panel" role="main" aria-label="Đăng ký">
            <div className="left">
              <div className="brand" style={{ alignItems: "flex-start" }}>
                <div className="brand-icon" title="Logo">
                  <img
                    src={iconUrl}
                    alt="logo"
                    onError={(e: any) => (e.currentTarget.src = fallbackIcon)}
                  />
                </div>

                <div className="brand-info">
                  <div className="brand-title">CRM</div>
                  <div className="brand-sub">Hệ thống quản lý quan hệ khách hàng</div>
                </div>
              </div>

              <Title level={2} className="title" style={{ margin: 0 }}>
                Đăng ký
              </Title>

              <Paragraph className="desc" style={{ margin: 0 }}>
                Vui lòng nhập thông tin của bạn để tạo tài khoản mới trong hệ thống.
              </Paragraph>

              <div className="form-box" style={{ marginTop: 12 }}>
                <Form
                  name="register_form"
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{ fullname: "", username: "", password: "" }}
                  requiredMark={false}
                >
                  <Form.Item
                    label={
                      <span>
                        <span className="label-star">*</span>
                        Họ và tên
                      </span>
                    }
                    name="fullname"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                  >
                    <Input
                      size="large"
                      placeholder="Nhập họ và tên"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span>
                        <span className="label-star">*</span>
                        Email
                      </span>
                    }
                    name="username"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Nhập email"
                      prefix={<MailOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span>
                        <span className="label-star">*</span>
                        Mật khẩu
                      </span>
                    }
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu" },
                      { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="Nhập mật khẩu"
                      prefix={<LockOutlined />}
                      visibilityToggle
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button htmlType="submit" block className="btn-login" loading={loading}>
                      Đăng ký
                    </Button>
                  </Form.Item>

                  <div className="actions-row">
                    <span>Bạn đã có tài khoản?</span>
                    <div
                      className="link-muted"
                      onClick={() => navigate("/login")}
                    >
                      Đăng nhập
                    </div>
                  </div>
                </Form>
              </div>
            </div>

            <div className="right">
              <img
                className="illustration"
                src={illustrationUrl}
                alt="illustration"
                onError={(e: any) => (e.currentTarget.src = fallbackIllustration)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
