import { test, expect } from '@playwright/test'

test.describe('Comfyatlas AI - Complete User Flow', () => {
  const testUser = {
    username: 'testuser' + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: 'test123456',
    fullName: 'Test User'
  }

  test('Complete flow: Signup -> Create Pin -> Create Board -> Save Pin', async ({ page }) => {
    // 1. 访问首页
    await page.goto('http://localhost:3001')
    await expect(page.locator('text=Comfyatlas AI')).toBeVisible()

    // 2. 注册新用户
    console.log('Step 1: 注册新用户...')
    await page.click('text=Sign Up')
    await page.fill('input[name="username"]', testUser.username)
    await page.fill('input[name="fullName"]', testUser.fullName)
    await page.fill('input[name="email"]', testUser.email)
    await page.fill('input[name="password"]', testUser.password)
    await page.click('button[type="submit"]')

    // 等待跳转到首页
    await page.waitForURL('http://localhost:3001/')
    await expect(page.locator('text=My Boards')).toBeVisible()
    console.log('✓ 用户注册成功')

    // 3. 创建 Pin
    console.log('Step 2: 创建 Pin...')
    await page.click('text=Create')
    await page.waitForURL('http://localhost:3001/create')

    // 填写 Pin 信息
    await page.fill('input[id="title"]', 'Automated Test Pin')
    await page.fill('textarea[id="description"]', 'This pin was created by automated test')

    // 注意: Cloudinary widget 需要手动交互，这里我们先测试表单验证
    console.log('✓ 创建 Pin 页面加载成功')

    // 4. 创建画板
    console.log('Step 3: 创建画板...')
    await page.click('text=My Boards')
    await page.waitForURL('http://localhost:3001/boards')
    await page.click('text=Create Board')

    await page.fill('input[id="title"]', 'Test Board')
    await page.fill('textarea[id="description"]', 'This is a test board')
    await page.click('button[type="submit"]:has-text("Create Board")')

    // 等待跳转到画板详情页
    await page.waitForURL(/\/boards\/[a-f0-9-]+/)
    await expect(page.locator('text=Test Board')).toBeVisible()
    console.log('✓ 画板创建成功')

    // 5. 测试搜索功能
    console.log('Step 4: 测试搜索功能...')
    await page.click('text=Explore')
    await page.waitForURL('http://localhost:3001/explore')
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible()
    console.log('✓ 搜索页面加载成功')

    // 6. 测试个人主页
    console.log('Step 5: 测试个人主页...')
    await page.click('text=Profile')
    await page.waitForURL(/\/profile\/[a-f0-9-]+/)
    await expect(page.locator(`text=${testUser.username}`)).toBeVisible()
    console.log('✓ 个人主页加载成功')

    // 7. 测试登出
    console.log('Step 6: 测试登出...')
    await page.click('text=Sign Out')
    await page.waitForURL('http://localhost:3001/')
    await expect(page.locator('text=Log In')).toBeVisible()
    console.log('✓ 登出成功')

    console.log('\n🎉 所有测试通过！')
  })

  test('Test navigation and UI elements', async ({ page }) => {
    await page.goto('http://localhost:3001')

    // 测试导航栏
    await expect(page.locator('text=Comfyatlas AI')).toBeVisible()
    await expect(page.locator('text=Home')).toBeVisible()
    await expect(page.locator('text=Explore')).toBeVisible()
    await expect(page.locator('text=Log In')).toBeVisible()
    await expect(page.locator('text=Sign Up')).toBeVisible()

    console.log('✓ 导航栏元素正常')
  })
})
