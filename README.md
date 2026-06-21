# 翁法罗斯一年历

一个以《崩坏：星穹铁道》翁法罗斯为主题的非官方网页日历。项目将现实公历月份映射为翁法罗斯月份，并将一天映射为 5 个时段与 25 刻，同时提供月份总览、日期详情和本地日程管理。

## 线上预览

- [Vercel / International](https://omphalos-calendar.vercel.app)
- [中国大陆镜像 / Mainland China mirror](https://omphalos-calendar-omphalos-calendar-d2dtch7e804ee9.webapps.tcloudbase.com/)

## 功能

- 显示浏览器本地现实日期、时间及对应的翁法罗斯月份、时段与刻。
- 展示 12 个翁法罗斯月份及对应的月份详情页。
- 日期详情支持添加、编辑和删除日程。
- 日程保存在浏览器 `localStorage`，刷新后仍会保留。
- 今日神谕及页面氛围背景根据当日神谕说话者稳定切换。
- 日期按钮、日程状态、当前日期和特殊日期使用互不影响布局的覆盖层组合。

## 本地运行

环境要求：Node.js 22。

```bash
git clone https://github.com/Rukkhadevata-Karrenay/omphalos-calendar.git
cd omphalos-calendar
npm install
npm run dev
```

Vite 开发服务器默认地址为 `http://localhost:5173/`。

## 检查与构建

```bash
npm run test:time
npm run check:assets
npm run build
npm run preview
```

`npm run preview` 默认提供本地生产预览地址 `http://localhost:4173/`。

## 技术栈

- React 19
- Vite 7
- TypeScript
- CSS
- 浏览器 `localStorage`

## 项目结构

```text
src/
├─ components/    页面与交互组件
├─ data/          月份、时段、神谕与素材路径配置
├─ hooks/         状态与 localStorage 逻辑
├─ types/         TypeScript 类型
└─ utils/         日期、时间与神谕计算

public/assets/
├─ calendar-composition/
│  ├─ bases/                 月份详情正式底图
│  ├─ panels-clean/          日历区域 clean panel
│  ├─ date-buttons/          原始日期按钮素材
│  ├─ date-buttons-uniform/  页面使用的统一按钮素材
│  └─ final-reference/       仅供人工验收，正式页面禁止引用
└─ omphalos/
   ├─ overview/              首页封面与安全模块素材
   ├─ oracle-backgrounds/    今日神谕说话者背景
   ├─ year-cards/            一年历月份卡片
   ├─ time-widget/           翁法罗斯时钟素材
   └─ eggs/                  总览头图等补充素材
```

月份详情页采用“正式底图 + clean panel + 日期按钮图片 + 透明点击热区”组合。月份素材映射集中在 `src/data/monthCompositionAssets.ts`，fiveWeek / sixWeek 布局集中在 `src/data/monthButtonLayoutConfig.ts`。正式页面不会引用 `final-reference` 或 `final-month-templates`。

首页封面继续使用一年历正式封面图；今日神谕、页面氛围背景和一年历总览外层背景按神谕说话者切换。无名黄金裔或未识别说话者使用默认总览背景。

## 作者与鸣谢

- 网站作者、设计与开发：[Karrenay Rukkhadevata](https://github.com/Rukkhadevata-Karrenay)
- 一年历总览图来源：Ankiiy_Nymity（全平台同名）
- 游戏相关名称、设定、角色与原始素材版权归原权利方所有。

感谢 Ankiiy_Nymity 提供一年历总览图授权与视觉参考支持。总览图仅用于本非商业粉丝项目的学习、展示与个人使用；未经原作者允许，请勿二次使用、转载或商用。

## 版权与用途声明

本项目是非官方粉丝作品，不隶属于 HoYoverse / miHoYo，不代表任何官方立场，也不用于商业用途。

网站代码、页面组织与交互实现 © 2026 Karrenay Rukkhadevata。保留所有权利。公开仓库仅供查看、学习和非商业展示；除非获得明确书面许可，不授予复制、修改、再分发或商业使用代码及项目素材的权利。

第三方图片、游戏相关素材和一年历总览图不包含在任何代码授权范围内，其权利归各自权利方所有。详见 [NOTICE.md](./NOTICE.md)。
