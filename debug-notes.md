# Debug Notes - GitHub Pages

## 問題
GitHub Pages (https://sowk-rose.github.io/renesas-esg-monitor/) で白い画面が表示される

## 原因
1. JSファイルのパスが絶対パス (`/src/main.js`) になっている → GitHub Pagesではリポジトリ名がサブパスになるため `/renesas-esg-monitor/src/main.js` でないと404になる
2. favicon.pngも `/favicon.png` で404
3. Tailwind CDNも読み込み失敗（HTTPS制限の可能性）

## 修正
- すべてのパスを相対パス (`./src/main.js`, `./public/favicon.png`) に変更する
- docs/index.html と web/index.html の両方を修正
