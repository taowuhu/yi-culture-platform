# 东方传统文化 App

一个以确定性术数计算、传统原典和现代移动体验为基础的东方传统知识 App。

## V0.2 功能

- 周易起卦
- 三枚铜钱起卦
- 手动 6/7/8/9 起卦
- 本卦 / 动爻 / 变卦
- 卦辞 / 爻辞
- 原典来源
- 本地历史记录

## Screenshots

> 截图预留位置：首页、铜钱起卦、起卦结果、历史记录

![首页](docs/screenshots/home.png)

![铜钱起卦](docs/screenshots/coin-casting.png)

![起卦结果](docs/screenshots/result.png)

![历史记录](docs/screenshots/history.png)

## Tech Stack

- Expo
- React Native
- TypeScript
- npm workspaces

## Run locally

```bash
npm install
npm run dev:mobile
```

Web 预览：

```bash
npm run web
```

## Architecture

- **apps/mobile** – Expo 移动应用（当前 V0.2 产品入口）
- **packages/domain** – 共享领域契约与确定性计算核心
- **packages/iching** – 周易起卦引擎、原典数据与来源

## Roadmap

- UI polish
- Evidence
- Grounded AI
- Bazi

## Verification

```bash
npm test
npm run typecheck
npm run doctor
```
