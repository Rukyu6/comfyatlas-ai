# Comfyatlas AI - 功能详解

## 🏗️ 系统架构

```
用户浏览器
    ↓
Next.js 前端 (React 组件)
    ↓
├─→ Supabase (数据库 + 认证)
│   ├─ 用户数据
│   ├─ Pins 数据
│   └─ Boards 数据
│
└─→ Cloudinary (图片存储)
    └─ 所有上传的图片
```

## 📱 核心功能详解

### 1. 用户认证系统

**文件位置:**
- `app/signup/page.tsx` - 注册页面
- `app/login/page.tsx` - 登录页面
- `components/Header.tsx` - 导航栏 (显示登录状态)

**工作原理:**
1. 用户填写邮箱和密码
2. Supabase Auth 处理认证
3. 成功后创建 session cookie
4. 自动在 `profiles` 表创建用户资料 (通过数据库触发器)

**代码示例:**
```typescript
// 注册
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { username, full_name } // 额外信息
  }
})

// 登录
const { error } = await supabase.auth.signInWithPassword({
  email,
  password
})
```

**安全特性:**
- 密码自动加密 (bcrypt)
- Session 基于 JWT token
- Row Level Security (RLS) 保护数据

---

### 2. 创建 Pin (上传图片)

**文件位置:**
- `app/create/page.tsx` - 创建页面
- `components/SavePinButton.tsx` - 保存按钮

**工作流程:**
```
1. 用户点击上传区域
   ↓
2. Cloudinary Widget 打开
   ↓
3. 用户选择图片
   ↓
4. 图片上传到 Cloudinary
   ↓
5. 返回图片 URL
   ↓
6. 填写标题、描述
   ↓
7. 保存到 Supabase pins 表
```

**代码示例:**
```typescript
// Cloudinary 上传
<CldUploadWidget
  uploadPreset="comfyatlas"
  onSuccess={(result) => {
    setImageUrl(result.info.secure_url)
    setImageWidth(result.info.width)
    setImageHeight(result.info.height)
  }}
/>

// 保存到数据库
const { data, error } = await supabase
  .from('pins')
  .insert({
    user_id: user.id,
    title,
    description,
    image_url: imageUrl,
    image_width: imageWidth,
    image_height: imageHeight
  })
```

**为什么存储宽高?**
- 瀑布流布局需要提前知道图片尺寸
- 避免页面跳动 (layout shift)

---

### 3. 画板系统

**文件位置:**
- `app/boards/page.tsx` - 我的画板列表
- `app/boards/create/page.tsx` - 创建画板
- `app/boards/[id]/page.tsx` - 画板详情

**数据库关系:**
```
boards (画板)
  ↓ 一对多
board_pins (关联表)
  ↓ 多对一
pins (图片)
```

**工作原理:**
1. 用户创建画板 (title, description, is_private)
2. 在 Pin 详情页点击 "Save"
3. 选择要保存到的画板
4. 在 `board_pins` 表创建关联记录

**代码示例:**
```typescript
// 保存 Pin 到画板
const { error } = await supabase
  .from('board_pins')
  .insert({
    board_id: boardId,
    pin_id: pinId
  })

// 查询画板的所有 Pins
const { data } = await supabase
  .from('board_pins')
  .select(`
    pin_id,
    pins (id, title, image_url, image_width, image_height)
  `)
  .eq('board_id', boardId)
```

**隐私控制:**
- `is_private = true`: 只有创建者能看到
- `is_private = false`: 所有人都能看到
- 通过 Row Level Security (RLS) 实现

---

### 4. 瀑布流布局

**文件位置:**
- `app/page.tsx` - 首页
- 使用 `react-masonry-css` 库

**工作原理:**
```typescript
const breakpointColumns = {
  default: 5,    // 超宽屏: 5列
  1536: 4,       // 2XL: 4列
  1280: 3,       // XL: 3列
  1024: 3,       // LG: 3列
  768: 2,        // MD: 2列
  640: 1         // SM: 1列
}

<Masonry
  breakpointCols={breakpointColumns}
  className="flex -ml-4 w-auto"
  columnClassName="pl-4 bg-clip-padding"
>
  {pins.map(pin => <PinCard />)}
</Masonry>
```

**为什么用 Masonry?**
- Pinterest 风格的不规则网格
- 自动计算列高度
- 响应式适配不同屏幕

---

### 5. 搜索功能

**文件位置:**
- `app/explore/page.tsx`

**搜索逻辑:**
```typescript
const { data } = await supabase
  .from('pins')
  .select('*')
  .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  .order('created_at', { ascending: false })
  .limit(50)
```

**搜索范围:**
- Pin 标题 (title)
- Pin 描述 (description)
- 不区分大小写 (ilike)

**未来可扩展:**
- 搜索用户
- 搜索画板
- 标签系统
- 全文搜索 (PostgreSQL FTS)

---

### 6. 用户个人主页

**文件位置:**
- `app/profile/[id]/page.tsx`

**显示内容:**
- 用户头像 (avatar_url)
- 用户名 (username)
- 全名 (full_name)
- 个人简介 (bio)
- 该用户创建的所有 Pins

**URL 格式:**
```
/profile/[user_id]
例如: /profile/123e4567-e89b-12d3-a456-426614174000
```

---

## 🔒 安全机制

### Row Level Security (RLS)

**Profiles 表:**
```sql
-- 所有人可以查看
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

-- 只能更新自己的资料
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

**Pins 表:**
```sql
-- 所有人可以查看
CREATE POLICY "Pins are viewable by everyone"
  ON pins FOR SELECT USING (true);

-- 只能创建自己的 Pin
CREATE POLICY "Users can create pins"
  ON pins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 只能删除自己的 Pin
CREATE POLICY "Users can delete own pins"
  ON pins FOR DELETE USING (auth.uid() = user_id);
```

**Boards 表:**
```sql
-- 公开画板所有人可见，私密画板只有创建者可见
CREATE POLICY "Public boards are viewable by everyone"
  ON boards FOR SELECT
  USING (is_private = false OR user_id = auth.uid());
```

---

## 🎨 UI/UX 设计

### 颜色方案
- 主色: 红色 (#DC2626 - red-600)
- 背景: 白色/灰色
- 文字: 灰黑色

### 组件风格
- 圆角按钮 (rounded-full)
- 卡片阴影 (shadow-lg)
- 悬停效果 (hover:brightness-90)
- 过渡动画 (transition-all)

### 响应式设计
```
手机 (< 640px):  1列
平板 (640-1024px): 2-3列
电脑 (> 1024px):  3-5列
```

---

## 📊 数据库表结构

### profiles (用户资料)
```sql
id          UUID (主键, 关联 auth.users)
username    TEXT (唯一)
full_name   TEXT
avatar_url  TEXT
bio         TEXT
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### pins (图片)
```sql
id           UUID (主键)
user_id      UUID (外键 → profiles)
title        TEXT
description  TEXT
image_url    TEXT (Cloudinary URL)
image_width  INTEGER
image_height INTEGER
source_url   TEXT (可选)
created_at   TIMESTAMP
```

### boards (画板)
```sql
id              UUID (主键)
user_id         UUID (外键 → profiles)
title           TEXT
description     TEXT
is_private      BOOLEAN
cover_image_url TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### board_pins (画板-图片关联)
```sql
id         UUID (主键)
board_id   UUID (外键 → boards)
pin_id     UUID (外键 → pins)
created_at TIMESTAMP
UNIQUE(board_id, pin_id)  -- 防止重复保存
```

---

## 🚀 性能优化

### 1. 图片优化
- Cloudinary 自动压缩
- 响应式图片 (srcset)
- 懒加载 (Next.js Image)

### 2. 数据库索引
```sql
CREATE INDEX idx_pins_user_id ON pins(user_id);
CREATE INDEX idx_pins_created_at ON pins(created_at DESC);
CREATE INDEX idx_boards_user_id ON boards(user_id);
```

### 3. 查询优化
- 限制返回数量 (LIMIT 50)
- 只查询需要的字段
- 使用 JOIN 减少请求次数

---

## 🐛 常见问题

**Q: 为什么图片上传后看不到?**
A: 检查 Cloudinary upload preset 是否设为 "Unsigned"

**Q: 登录后显示 "You must be logged in"**
A: Session cookie 可能过期，重新登录

**Q: 创建 Pin 失败**
A: 检查 Supabase RLS 策略是否正确配置

**Q: 搜索没有结果**
A: 确保数据库有数据，检查搜索关键词

---

## 📈 未来功能扩展

### 短期 (1-2周)
- [ ] 点赞功能
- [ ] 评论系统
- [ ] 关注用户
- [ ] 通知系统

### 中期 (1-2月)
- [ ] AI 图像生成集成
- [ ] 标签系统
- [ ] 高级搜索过滤
- [ ] 推荐算法

### 长期 (3-6月)
- [ ] 付费订阅
- [ ] 移动端 App
- [ ] 视频支持
- [ ] 协作画板

---

**这就是整个系统的工作原理！有任何不明白的地方随时问我。**
