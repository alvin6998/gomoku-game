# ⚫ 五子棋 Gomoku

一個用純 HTML / CSS / JavaScript 打造的網頁版五子棋(Gomoku),支援人機對戰，內建三種難度的 AI。免安裝、免建置，直接開瀏覽器就能玩。

## 🎮 線上試玩

👉 [點我開始對局](https://alvin6998.github.io/gomoku-game/)

## ✨ 功能特色

- 🖤 15×15 標準棋盤，經典黑白子對戰
- 🤖 三種 AI 難度
  - **初學者**：隨機落子
  - **普通**：具備基本攻防判斷
  - **困難**：多步搜尋，會預判玩家威脅
- ⏱ 即時計時器 / 手數統計
- 🏆 對局結束顯示完整結果（勝負、耗時、手數、難度）
- 📱 響應式設計，手機、平板、電腦都能玩

## 🛠 技術

- 純 Vanilla JavaScript，無任何框架或套件依賴
- Canvas 2D 繪製棋盤與棋子
- 單一 `index.html` 檔案，包含 HTML / CSS / JS

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
- [ ] 深色模式
- [ ] 更高難度的 AI（Minimax + Alpha-Beta 剪枝）
- [ ] 對戰紀錄保存

歡迎透過 [Issues](https://github.com/alvin6998/gomoku-game/issues) 回報 bug 或提出功能建議 🙌

## 📄 授權

本專案採用 [LICENSE](./LICENSE) 授權條款。