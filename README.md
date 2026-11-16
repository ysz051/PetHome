# 寻宠之家 PetHome

> 面向「寻宠 / 遇见走失 / 领养」三类场景的宠物互助平台。参考「寻物启事网站」改造，采用 Spring Boot + Vue 3 前后端分离架构，适合作为全栈课程实训项目。

---

## 项目完成度

**结论：功能已完善，三类业务闭环，可作为实训项目直接演示与答辩。**

| 检查项 | 状态 | 说明 |
| --- | --- | --- |
| 核心业务闭环 | 已完成 | 发布 → 审核 → 展示 → 联系 → 标记完成 / 删除 |
| 两类用户身份 | 已完成 | 宠主、好心人、两者都是，注册与个人中心均可设置 |
| 遇见宠物现状 | 已完成 | 只是偶遇 / 在我身边 / 已带回家，前端、接口、数据库三层一致 |
| 领养独立频道 | 已完成 | 独立路由 `/adopt`、独立数据表、独立表单与筛选条件 |
| 图片 / 视频 | 已完成 | 图片最多 3 张，视频 1 个；本地磁盘存储 + 静态资源映射 |
| 联系方式保护 | 已完成 | 详情页默认脱敏，点击后查看完整号码并支持拨号/复制 |
| 登录与权限 | 已完成 | JWT 签发与拦截器校验，管理员接口二次校验 `role=1` |
| 管理后台 | 已完成 | 数据概览、内容审核、用户管理、分类管理 |
| 项目文档 | 已完成 | 建库脚本、接口文档、本 README、零依赖高保真原型 |
| 编译 / 启动验证 | 待本机执行 | 当前工作环境未安装 JDK、Maven、Node.js、MySQL，未实际执行构建 |

> 说明：以上结论基于对前端路由、页面、接口封装与后端 Controller、实体、SQL 的逐项核对。运行方式见「快速开始」，准备好环境后即可启动。

---

## 1. 需求与实现对照

| 原始需求 | 实现情况 |
| --- | --- |
| 宠主发布丢失宠物信息 | 「寻宠启事」频道：标题、宠物名字、品种、性别、毛色、特征、走失时间、走失地点、经纬度、联系方式、图片/视频 |
| 好心人发布偶遇线索 | 「遇见走失」频道：字段与寻宠类似，时间地点替换为发现时间/地点 |
| 好心人需说明宠物当前状态 | 新增 `petState` 字段：1 只是偶遇 / 2 宠物在我身边 / 3 已带回家暂养，列表可按此筛选 |
| 领养功能与上面两个页面分开 | 「领养专区」独立频道与独立数据表，额外包含年龄、健康状况、绝育/疫苗、送养原因、领养要求 |
| 用户联系方式和丢失定位 | 联系人、电话、微信；浏览器定位获取经纬度，详情页可跳转高德地图 |
| 内容需要可信 | 扩展了管理员审核：新发布默认待审核，通过后才会在前台展示 |

---

## 2. 功能清单

### 前台

- **首页**：频道入口、平台统计、最新求助、待领养推荐、关键词搜索
- **寻宠启事**：分类筛选、状态筛选（寻宠中 / 已找回）、最新/最热排序、分页、详情
- **遇见走失**：分类筛选、宠物现状筛选（三种状态）、详情
- **领养专区**：分类筛选、待领养/已领养筛选、领养须知、详情
- **发布**：三类表单按频道动态切换，图片上传（最多 3 张）、视频上传、浏览器定位、实时预览
- **详情**：图片轮播、特征与时间地点、宠物现状标签、联系方式脱敏与查看、高德地图跳转
- **个人中心**：我的发布（按频道分组，含待审核/驳回原因）、标记已找回/已归还/已领养、删除、资料与密码修改
- **登录注册**：账号或手机号登录，注册时选择身份（宠主 / 好心人 / 两者）

### 后台（`/#/admin`）

- **数据概览**：用户数、三类信息数、待审核数、已完成数、分类数、频道柱状图、审核队列
- **内容审核**：按频道与状态筛选，通过 / 驳回并填写驳回原因
- **用户管理**：角色切换、启用/禁用，内置管理员与当前登录账号受保护
- **分类管理**：新增、编辑、删除；分类下已有内容时禁止删除

### 零依赖原型

`prototype/` 下是一份可直接打开的高保真原型，覆盖首页、三个频道、详情、发布、登录注册、个人中心与管理后台，数据使用浏览器 `localStorage` 模拟，不需要后端和数据库。

---

## 3. 技术栈与架构

| 层次 | 技术 |
| --- | --- |
| 前端 | Vue 3.4、Vite 5、Vue Router 4（Hash 模式）、Element Plus 2.7、Axios |
| 后端 | Spring Boot 2.7.18、MyBatis-Plus 3.5.5、JWT（jjwt 0.11.5）、BCrypt、springdoc-openapi 1.7 |
| 数据库 | MySQL 8.0（utf8mb4） |
| 运行方式 | 前后端分离，开发期由 Vite 代理 `/api` 与 `/uploads` 到后端 |

```text
浏览器
  │  http://localhost:5173
  ▼
Vue 3 + Element Plus（Vite Dev Server）
  │  /api、/uploads 代理
  ▼
Spring Boot :8080
  ├─ AuthInterceptor（JWT 校验）
  ├─ Controller → Mapper（MyBatis-Plus）
  ├─ uploads/ 本地文件目录
  ▼
MySQL 8.0 :3306（pet_home）
```

---

## 4. 快速开始

### 4.1 只想打开网页看效果（零依赖）

**方式 A：直接双击**

直接双击 `prototype/index.html`，用 Chrome / Edge / Safari 打开即可。

macOS 终端也可以执行：

```bash
open prototype/index.html
```

**方式 B：本地静态服务（推荐）**

部分浏览器对 `file://` 下的本地存储或脚本有限制，可用 Python 起一个静态服务：

```bash
cd prototype
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

原型演示账号：

| 账号 | 密码 | 身份 |
| --- | --- | --- |
| linxiao | 123456 | 宠主 |
| chenmo | 123456 | 好心人 |
| admin | admin123 | 管理员 |

> 原型中的新发布信息默认为「待审核」，用管理员登录后在「内容审核」中通过，才会出现在前台列表。
> 数据异常时，在浏览器控制台执行 `localStorage.removeItem('pethome_proto_v3')` 后刷新即可恢复演示数据。

### 4.2 全栈运行

#### 环境要求

| 软件 | 版本 |
| --- | --- |
| JDK | 8 及以上 |
| Maven | 3.6 及以上 |
| MySQL | 8.0 |
| Node.js | 18 及以上 |

#### 第一步：初始化数据库

```bash
mysql -uroot -p < docs/schema.sql
```

脚本会创建 `pet_home` 数据库、5 张表，并写入 5 个宠物分类。

> 注意：脚本包含 `DROP DATABASE IF EXISTS pet_home`，重复执行会清空已有数据。演示账号与示例信息由后端首次启动时自动写入。

#### 第二步：启动后端

先修改 [application.yml](backend/src/main/resources/application.yml) 中的数据库账号和密码，然后：

```bash
cd backend
mvn spring-boot:run
```

- 后端地址：`http://localhost:8080`
- Swagger 文档：`http://localhost:8080/swagger-ui.html`

首次启动会自动创建演示账号、分类和 6 条示例信息（已存在数据时不会重复插入）。

#### 第三步：启动前端

```bash
cd frontend
npm install
npm run dev
```

访问 `http://localhost:5173`。前端使用 Hash 路由，频道地址形如：

- 寻宠启事：`http://localhost:5173/#/lost`
- 遇见走失：`http://localhost:5173/#/found`
- 领养专区：`http://localhost:5173/#/adopt`
- 管理后台：`http://localhost:5173/#/admin`

#### 演示账号

| 账号 | 密码 | 身份 |
| --- | --- | --- |
| admin | admin123 | 管理员 |
| linxiao | 123456 | 宠主 |
| chenmo | 123456 | 好心人 |

### 4.3 打包部署

```bash
# 后端
cd backend
mvn clean package -DskipTests
java -jar target/pet-home-backend-1.0.0.jar

# 前端
cd frontend
npm run build
# 构建产物在 dist/，使用 Nginx 托管，并将 /api 与 /uploads 反向代理到后端
```

Nginx 参考配置：

```nginx
server {
    listen 80;
    root /var/www/pet-home/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
    }
    location /uploads/ {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

---

## 5. 目录结构

```text
pet-home/
├─ README.md
├─ prototype/                  # 零依赖高保真原型
│  ├─ index.html
│  ├─ css/style.css
│  └─ js/seed.js, js/app.js
├─ backend/                    # Spring Boot 后端
│  ├─ pom.xml
│  └─ src/main/
│     ├─ java/com/pethome/
│     │  ├─ common/            # Result、BusinessException、全局异常处理
│     │  ├─ config/            # JWT 拦截器、跨域、MyBatis-Plus、Swagger、初始化数据
│     │  ├─ controller/        # 认证、寻宠、遇见、领养、分类、上传、管理后台
│     │  ├─ dto/               # 登录、注册、审核、资料修改
│     │  ├─ entity/            # User / Category / LostPet / FoundPet / Adoption
│     │  ├─ mapper/            # MyBatis-Plus Mapper
│     │  └─ util/JwtUtil.java
│     └─ resources/application.yml
├─ frontend/                   # Vue 3 前端
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ index.html
│  └─ src/
│     ├─ api/                  # axios 封装与接口定义
│     ├─ components/           # PetCard
│     ├─ layout/               # DefaultLayout
│     ├─ router/               # 路由与登录/管理员守卫
│     ├─ store/user.js         # 登录状态（localStorage 持久化）
│     ├─ styles/global.css
│     ├─ utils/channel.js      # 三频道配置、状态文案、时间格式化
│     └─ views/                # 首页、列表、详情、发布、个人中心、登录、后台
└─ docs/
   ├─ schema.sql               # 建库建表 + 分类初始化
   └─ api.md                   # 接口文档
```

---

## 6. 核心设计

### 6.1 三个频道与状态机

三类信息共用一个 `status` 字段，在不同频道下含义不同：

| status | 寻宠启事 | 遇见走失 | 领养专区 |
| --- | --- | --- | --- |
| 0 | 待审核 | 待审核 | 待审核 |
| 1 | 寻宠中 | 等待认领 | 待领养 |
| 2 | 已驳回 | 已驳回 | 已驳回 |
| 3 | 已找回 | 已归还 | 已领养 |

- 公开列表只返回 `status` 为 1 或 3 的数据
- 发布者本人与管理员可以查看待审核、已驳回的数据
- 修改发布内容后会重新进入待审核状态

### 6.2 遇见走失的宠物现状

这是「遇见走失」区别于「寻宠启事」的关键字段：

| petState | 含义 | 说明 |
| --- | --- | --- |
| 1 | 只是偶遇 | 看到它经过或停留，已经离开，无法控制 |
| 2 | 宠物在我身边 | 一直跟着我或被留住，暂时看护中 |
| 3 | 已带回家暂养 | 已安置在家中，等待主人认领 |

数据库、实体、发布表单、列表筛选、详情标签均已覆盖该字段；选择 2 或 3 时会提示填写可联系的方式。

### 6.3 审核与权限

- 新发布信息默认 `status=0`，管理员在后台通过后才对外展示
- 登录成功后签发 JWT，载荷包含用户 ID、用户名、角色
- `AuthInterceptor` 统一校验 `/api/**`：登录/注册与公开 GET 接口放行，其余必须携带合法 Token
- 删除、修改、标记完成仅限发布者本人或管理员
- 管理后台所有接口额外校验 `role=1`

### 6.4 文件上传

- 上传接口：`POST /api/files/upload`，表单字段名 `file`
- 支持 jpg / jpeg / png / gif / webp / mp4 / mov / webm，单文件 50MB
- 文件写入 `./uploads/yyyyMM/`，返回 `/uploads/yyyyMM/xxx.ext`
- 后端通过 `WebConfig#addResourceHandlers` 将 `/uploads/**` 映射到本地目录
- 数据库 `images` 字段保存逗号分隔的多个图片地址，`video_url` 保存单个视频地址

### 6.5 统一响应

```json
{ "code": 200, "message": "操作成功", "data": null }
```

| code | 含义 |
| --- | --- |
| 200 | 成功 |
| 400 | 参数或业务校验失败 |
| 401 | 未登录 / Token 失效 |
| 403 | 无权限（非本人、非管理员、账号禁用） |
| 404 | 数据不存在 |
| 500 | 服务器异常 |

---

## 7. 接口与数据库

完整说明见：

- [接口文档](docs/api.md)
- [数据库脚本](docs/schema.sql)

接口分组：

| 分组 | 路径前缀 | 说明 |
| --- | --- | --- |
| 认证 | `/api/auth` | 注册、登录、当前用户、修改资料 |
| 寻宠启事 | `/api/lost-pets` | 列表、详情、我的发布、发布、修改、删除、标记已找回 |
| 遇见走失 | `/api/found-pets` | 上述能力 + `petState` 筛选与标记已归还 |
| 领养专区 | `/api/adoptions` | 上述能力 + 领养字段与标记已领养 |
| 分类 | `/api/categories` | 公开分类列表 |
| 文件 | `/api/files/upload` | 图片 / 视频上传 |
| 管理后台 | `/api/admin` | 概览、审核、用户、分类 |

数据表：

| 表名 | 说明 |
| --- | --- |
| `sys_user` | 用户（角色、身份、联系方式、启停状态） |
| `pet_category` | 宠物分类 |
| `lost_pet` | 寻宠启事 |
| `found_pet` | 遇见走失线索（含 `pet_state`） |
| `adoption` | 领养信息 |

---

## 8. 已知边界与可扩展点

以下是当前版本有意保留的简化，不影响主线演示：

- **地图**：使用浏览器 Geolocation 获取经纬度，详情页跳转高德地图查看，未内嵌地图组件
- **编辑入口**：后端已提供 `PUT` 修改接口，前端暂未提供编辑页面
- **站内沟通**：联系依赖电话 / 微信，没有站内私信、领养申请与审核流程
- **图片存储**：使用本地磁盘，适合单机部署；多实例部署需替换为对象存储
- **示例图片**：后端初始化数据的图片使用在线生成地址，离线环境下会显示占位图
- **测试**：当前以功能验收为主，未补充单元测试与端到端测试

可扩展方向：宠物走失地图聚合、线索与启事的智能匹配、领养申请表单、消息通知、图片对象存储、后台操作日志。

---

## 9. 常见问题

| 问题 | 排查方式 |
| --- | --- |
| 后端启动报数据库连接失败 | 确认 MySQL 已启动、`pet_home` 库已创建、`application.yml` 账号密码正确 |
| 前端接口 401 | Token 过期或未登录，重新登录；拦截器会自动清理本地登录状态 |
| 图片上传后 404 | 确认后端进程对 `pethome.upload.dir` 有写权限，且前端通过 `/uploads` 代理访问 |
| 端口被占用 | 后端改 `server.port`，前端改 `vite.config.js` 中的 `server.port` |
| 原型数据混乱 | 控制台执行 `localStorage.removeItem('pethome_proto_v3')` 后刷新 |
| 新发布的信息看不到 | 默认待审核，用 `admin / admin123` 登录后台，在「内容审核」中通过 |

---

## 10. 交付清单

- `prototype/`：可直接打开的高保真原型，覆盖全部页面与交互
- `backend/`：Spring Boot 后端源码，含 JWT 鉴权、审核、上传、初始化数据
- `frontend/`：Vue 3 前端源码，含三个频道、发布、详情、个人中心与管理后台
- `docs/schema.sql`：建库建表脚本
- `docs/api.md`：接口文档
- `README.md`：项目说明、运行指南与验收清单
