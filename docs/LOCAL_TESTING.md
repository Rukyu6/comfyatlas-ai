# 本地测试指南

## 📋 测试前准备

### 1. 确保已完成设置

- [ ] Supabase 项目已创建
- [ ] 数据库脚本已运行
- [ ] Cloudinary 账号已创建
- [ ] Upload preset 已配置
- [ ] 环境变量已填写

### 2. 检查环境变量

打开 `.env.local` 文件，确保所有值都已填写:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefg...
```

## 🚀 启动开发服务器

```bash
cd C:\Users\YAGEW\comfyatlas-pinterest
npm run dev
```

等待编译完成，看到:
```
✓ Ready in 3.2s
○ Local:   http://localhost:3000
```

## 🧪 测试流程

### 测试 1: 注册新用户

1. 打开浏览器访问 http://localhost:3000
2. 点击右上角 "Sign Up"
3. 填写信息:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `test123456`
4. 点击 "Sign up"

**预期结果:**
- 自动跳转到首页
- 右上角显示 "My Boards", "Profile", "Sign Out"
- 页面显示 "Welcome to Comfyatlas AI"

**如果失败:**
- 打开浏览器控制台 (F12)
- 查看 Console 标签的错误信息
- 检查 Network 标签，看 Supabase 请求是否成功

---

### 测试 2: 创建第一个 Pin

1. 点击导航栏 "Create"
2. 点击上传区域
3. Cloudinary Widget 应该弹出
4. 选择一张图片上传
5. 等待上传完成，图片预览显示
6. 填写:
   - Title: `My First Pin`
   - Description: `This is a test pin`
7. 点击 "Create Pin"

**预期结果:**
- 跳转到 Pin 详情页
- 显示你上传的图片
- 显示标题和描述
- 右上角有 "Save" 按钮

**如果失败:**
- Cloudinary Widget 没弹出: 检查 `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- 上传失败: 检查 upload preset 是否为 "Unsigned"
- 保存失败: 检查 Supabase 连接和 RLS 策略

---

### 测试 3: 创建画板

1. 点击导航栏 "My Boards"
2. 点击 "Create Board"
3. 填写:
   - Board Title: `Travel Inspiration`
   - Description: `Places I want to visit`
4. 点击 "Create Board"

**预期结果:**
- 跳转到画板详情页
- 显示画板标题和描述
- 显示 "No pins in this board yet"

---

### 测试 4: 保存 Pin 到画板

1. 回到首页 (点击 "Comfyatlas AI" logo)
2. 点击你创建的 Pin
3. 点击 "Save" 按钮
4. 弹出模态框，显示你的画板列表
5. 点击 "Travel Inspiration"

**预期结果:**
- 显示 "Pin saved successfully!"
- 模态框关闭
- 进入 "My Boards" > "Travel Inspiration"
- 应该能看到刚才保存的 Pin

---

### 测试 5: 搜索功能

1. 点击导航栏 "Explore"
2. 在搜索框输入 "First"
3. 点击搜索按钮

**预期结果:**
- 显示包含 "First" 的 Pin
- 应该能看到 "My First Pin"

---

### 测试 6: 用户个人主页

1. 点击导航栏 "Profile"
2. 应该显示你的个人主页

**预期结果:**
- 显示用户名
- 显示你创建的所有 Pins
- 瀑布流布局

---

### 测试 7: 登出和登录

1. 点击 "Sign Out"
2. 应该跳转到首页，右上角显示 "Log In" 和 "Sign Up"
3. 点击 "Log In"
4. 输入之前的邮箱和密码
5. 点击 "Log in"

**预期结果:**
- 成功登录
- 回到首页
- 右上角显示用户菜单

---

## 🔍 调试技巧

### 1. 查看浏览器控制台

按 F12 打开开发者工具:
- **Console**: 查看 JavaScript 错误
- **Network**: 查看 API 请求
- **Application > Cookies**: 查看 session

### 2. 查看 Supabase 数据

1. 打开 Supabase Dashboard
2. 点击 "Table Editor"
3. 查看各个表的数据:
   - `profiles`: 应该有你的用户记录
   - `pins`: 应该有你创建的 Pin
   - `boards`: 应该有你的画板
   - `board_pins`: 应该有关联记录

### 3. 查看 Cloudinary 图片

1. 打开 Cloudinary Dashboard
2. 点击 "Media Library"
3. 应该能看到你上传的图片

### 4. 查看服务器日志

在运行 `npm run dev` 的终端窗口:
- 查看编译错误
- 查看 API 路由日志
- 查看 Supabase 查询

---

## ✅ 测试检查清单

完成所有测试后，确认:

- [ ] 用户注册成功
- [ ] 用户登录成功
- [ ] 图片上传成功
- [ ] 创建 Pin 成功
- [ ] 创建画板成功
- [ ] 保存 Pin 到画板成功
- [ ] 搜索功能正常
- [ ] 个人主页显示正常
- [ ] 瀑布流布局正常
- [ ] 响应式设计正常 (调整浏览器窗口大小)

---

## 🐛 常见错误和解决方案

### 错误 1: "Failed to fetch"

**原因:** Supabase URL 或 Key 错误

**解决:**
1. 检查 `.env.local` 文件
2. 确保 URL 以 `https://` 开头
3. 确保 Key 完整复制
4. 重启开发服务器 (Ctrl+C 然后 `npm run dev`)

---

### 错误 2: "Upload widget not found"

**原因:** Cloudinary 配置错误

**解决:**
1. 检查 `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
2. 确保 upload preset 名称为 "comfyatlas"
3. 确保 preset 设为 "Unsigned"

---

### 错误 3: "You must be logged in"

**原因:** Session 过期或 RLS 策略问题

**解决:**
1. 重新登录
2. 检查 Supabase SQL 脚本是否完整运行
3. 在 Supabase Dashboard > Authentication > Policies 检查策略

---

### 错误 4: "new row violates row-level security policy"

**原因:** RLS 策略配置错误

**解决:**
1. 重新运行 `lib/supabase/schema.sql`
2. 确保所有 CREATE POLICY 语句都执行成功
3. 检查 Supabase Dashboard > Table Editor > [表名] > Policies

---

## 📱 测试响应式设计

### 桌面 (> 1024px)
- 打开浏览器全屏
- 瀑布流应该显示 3-5 列

### 平板 (768-1024px)
- 按 F12 打开开发者工具
- 点击设备模拟器图标
- 选择 "iPad"
- 瀑布流应该显示 2-3 列

### 手机 (< 768px)
- 选择 "iPhone 12 Pro"
- 瀑布流应该显示 1-2 列
- 导航栏应该适配小屏幕

---

## 🎉 测试完成！

如果所有测试都通过，说明应用运行正常！

**下一步:**
1. 创建更多测试数据
2. 邀请朋友测试
3. 准备部署到 Vercel

**遇到问题?**
- 查看错误信息
- 检查配置文件
- 查看文档: `docs/FEATURES_EXPLAINED.md`
- 或者直接问我！
