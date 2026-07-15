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

- Vanilla JavaScript (ES6)
- HTML5 Canvas
- CSS3
- Minimax
- Alpha-Beta Pruning
- Principal Variation Search (PVS)
- Zobrist Hashing

## 🧠 AI Engine

困難模式採用傳統棋類 AI 搜尋演算法，而非單純規則判斷。

### Search Algorithm

- Minimax
- Alpha-Beta Pruning
- Principal Variation Search (PVS)
- Iterative Deepening

### Search Optimization

- Transposition Table
- Zobrist Hashing
- Killer Move Heuristic
- History Heuristic
- Move Ordering
- Candidate Move Pruning

### Evaluation

- Pattern-based Evaluation
- Immediate Win Detection
- Immediate Threat Blocking
- Time-controlled Search

## 🚀 AI Features

- ✅ Minimax
- ✅ Alpha-Beta Pruning
- ✅ Principal Variation Search
- ✅ Iterative Deepening
- ✅ Transposition Table
- ✅ Zobrist Hashing
- ✅ Killer Move Heuristic
- ✅ History Heuristic
- ✅ Threat Search
- ✅ Pattern-based Evaluation

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