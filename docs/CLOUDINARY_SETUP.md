# Cloudinary 设置指南

## 1. 注册账号

1. 访问 https://cloudinary.com
2. 点击 "Sign Up Free"
3. 填写信息或使用 Google 账号登录
4. 验证邮箱

## 2. 获取 API 密钥

1. 登录后会看到 Dashboard
2. 在 "Account Details" 部分，复制:
   - **Cloud Name**: 通常是你的用户名
   - **API Key**: 一串数字
   - **API Secret**: 点击 "眼睛" 图标显示，然后复制

## 3. 创建 Upload Preset

1. 点击右上角齿轮图标 (Settings)
2. 点击左侧 "Upload"
3. 滚动到 "Upload presets" 部分
4. 点击 "Add upload preset"
5. 填写:
   - **Preset name**: `comfyatlas`
   - **Signing Mode**: 选择 **"Unsigned"** (重要！)
   - **Folder**: 留空或填 `comfyatlas`
6. 点击 "Save"

## 4. 验证设置

在 Upload presets 列表中应该能看到:
- Name: comfyatlas
- Mode: Unsigned ✓

---

**完成后，把 Cloud Name, API Key, API Secret 告诉我，我会帮你配置环境变量。**

## 为什么需要 Unsigned?

Unsigned 模式允许前端直接上传图片，不需要后端签名。这样更简单快速。
