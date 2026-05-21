# Supabase 设置指南

## 1. 创建项目

1. 访问 https://supabase.com
2. 点击 "New Project"
3. 填写信息:
   - Name: comfyatlas-ai
   - Database Password: (设置一个强密码，保存好)
   - Region: 选择 Northeast Asia (Tokyo) - 离中国最近
4. 点击 "Create new project"
5. 等待 2-3 分钟初始化

## 2. 获取 API 密钥

1. 项目创建后，点击左侧 "Project Settings" (齿轮图标)
2. 点击 "API"
3. 复制以下信息:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (很长的字符串)

## 3. 运行数据库脚本

1. 点击左侧 "SQL Editor"
2. 点击 "New query"
3. 打开本地文件: `C:\Users\YAGEW\comfyatlas-pinterest\lib\supabase\schema.sql`
4. 复制全部内容
5. 粘贴到 Supabase SQL Editor
6. 点击右下角 "Run" 按钮
7. 看到 "Success. No rows returned" 就成功了

## 4. 验证数据库

1. 点击左侧 "Table Editor"
2. 应该能看到 4 个表:
   - profiles
   - pins
   - boards
   - board_pins

如果看到这些表，说明数据库设置成功！

---

**完成后，把 Project URL 和 anon key 告诉我，我会帮你配置环境变量。**
