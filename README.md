# ⚫ 五子棋 Gomoku

一個用純 HTML / CSS / JavaScript 打造的網頁版五子棋(Gomoku),支援人機對戰，內建三種難度的 AI。免安裝、免建置，直接開瀏覽器就能玩。

## 🎮 線上試玩

👉 [點我開始對局](https://alvin6998.github.io/gomoku-game/)

## ✨ 功能特色

- 🖤 15×15 標準棋盤，經典黑白子對戰
- 🤖 三種 AI 難度
  - **初學者**：隨機落子
  - **普通**：Minimax + Alpha-Beta 搜尋
  - **困難**：Principal Variation Search、Iterative Deepening、Transposition Table、Threat Search 等進階搜尋技術
- ⏱ 即時計時器 / 手數統計
- 🏆 對局結束顯示完整結果（勝負、耗時、手數、難度）
- 📱 響應式設計，手機、平板、電腦都能玩

## 🛠 技術

### 前端

- 原生 JavaScript（Vanilla JavaScript ES6）
- HTML5 Canvas
- CSS3

## 🧠 AI 引擎

困難模式並非採用固定規則，而是結合多種經典棋類搜尋演算法與最佳化技術，能預測未來局勢並進行攻防決策。

### 🔍 搜尋演算法（Search Algorithms）

- 極小極大搜尋（Minimax）
- Alpha-Beta 剪枝（Alpha-Beta Pruning）
- 主要變化搜尋（Principal Variation Search, PVS）
- 逐步加深搜尋（Iterative Deepening）

### ⚡ 搜尋最佳化（Search Optimizations）

- 局面快取表（Transposition Table）
- Zobrist 雜湊（Zobrist Hashing）
- 殺手著法啟發式（Killer Move Heuristic）
- 歷史啟發式（History Heuristic）
- 走法排序（Move Ordering）
- 候選著法篩選（Candidate Move Pruning）

### 🎯 局面分析

- 棋型評估（Pattern-based Evaluation）
- 立即勝利檢測（Immediate Win Detection）
- 立即威脅阻擋（Immediate Threat Blocking）
- 時間控制搜尋（Time-controlled Search）

## 🚀 AI 核心功能

- ✅ 極小極大搜尋（Minimax）
- ✅ Alpha-Beta 剪枝
- ✅ 主要變化搜尋（Principal Variation Search, PVS）
- ✅ 逐步加深搜尋（Iterative Deepening）
- ✅ 局面快取表（Transposition Table）
- ✅ Zobrist 雜湊
- ✅ 殺手著法啟發式（Killer Move Heuristic）
- ✅ 歷史啟發式（History Heuristic）
- ✅ 威脅搜尋（Threat Search）
- ✅ 棋型評估（Pattern-based Evaluation）

## 🚀 本機執行

不需要任何安裝步驟，下載後直接用瀏覽器開啟即可：

```bash
git clone https://github.com/alvin6998/gomoku-game.git
cd gomoku-game
# 直接用瀏覽器打開 index.html
```

## 📋 玩法

1. 輸入你的名字
2. 選擇 AI 難度
3. 點擊「開始對局」
4. 點擊棋盤落子，先連成五子（橫、直、斜皆可）者獲勝

## 📌 待辦 / 未來計畫

- [ ] 悔棋功能
- [ ] AI vs AI 模式
- [ ] 開局庫（Opening Book）
- [ ] 對戰紀錄保存
- [ ] 棋譜匯出 / 匯入（SGF）
- [ ] Web Worker 多執行緒搜尋

歡迎透過 [Issues](https://github.com/alvin6998/gomoku-game/issues) 回報 bug 或提出功能建議 🙌

## 📄 授權

本專案採用 [LICENSE](./LICENSE) 授權條款。