# とうらぶ鍛刀 天井計算機 v1.0

『刀剣乱舞ONLINE』の期間限定鍛刀向け非公式ファンツールです。現在の顕現ポイントと、これから使う御札の枚数から、天井までの鍛刀回数と必要資源を計算します。

外部通信・広告・アクセス解析・ユーザー登録はありません。入力値はブラウザの LocalStorage にだけ保存されます。LocalStorage が利用できない場合も計算できます。

## 使い方

1. 「現在の顕現ポイント」を入力します。
2. これから使う梅・竹・松・富士の御札枚数を入力します。
3. 「天井まであと○回 鍛刀」と、その内訳・必要資源を確認します。

入力時に自動計算します。「再計算」ボタンは、自動計算が反映されない環境で同じ計算を再実行するための予備操作です。

現在ポイントと天井ポイントの入力欄は、上下ボタンまたは矢印キーで5Pずつ増減できます。直接入力する場合は任意の整数も使用できます。

## 計算仕様

- デフォルト天井：5,000P
- デフォルトレシピ：ALL700（木炭・玉鋼・冷却材・砥石を各700）
- 札なし：1回 5P
- 御札・梅：1枚 10P
- 御札・竹：1枚 15P
- 御札・松：1枚 20P
- 御札・富士：1枚 60P

札なしのみの回数は `ceil((天井 - 現在P) ÷ 5)`。御札を使う場合は、各札のポイントを先に加算し、残ったポイントを札なし鍛刀で補います。最終鍛刀回数は「使用する札の合計枚数＋追加の札なし鍛刀回数」です。

入力した御札だけで天井へ届く場合、大きな結果表示は「御札使用後、天井まであと0回」となります。天井を超えたポイントは切り捨てず「次周への持ち越し」として表示します。必要資源は、入力した御札をすべて使用する回数を基準に計算します。

天井と4資源の投入数は「詳細設定」から変更できます。4資源が同数なら「各資源」、異なる場合は資源ごとに表示します。

## ファイル構成

```text
.
├── index.html
├── style.css
├── script.js
├── README.md
├── GITHUB_PAGES_GUIDE.md
├── TEST_RESULTS.md
├── KNOWN_ISSUES.md
├── .nojekyll
├── tests/
│   └── test.js
└── assets/
    ├── fuda-ume.png
    ├── fuda-take.png
    ├── fuda-matsu.png
    └── fuda-fuji.png
```

ビルド、npm、Node.js、Reactは不要です。

## GitHub Pagesで公開する

リポジトリの `main` ブランチ直下へ、このフォルダの中身をすべてアップロードします。GitHubの `Settings` → `Pages` で、Sourceを `Deploy from a branch`、Branchを `main`、Folderを `/(root)` に設定して保存します。詳しくは [GITHUB_PAGES_GUIDE.md](./GITHUB_PAGES_GUIDE.md) を参照してください。

GitHub公式：[GitHub Pages の公開元を設定する](https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 更新方法

- 天井・ポイント・標準レシピの仕様変更：`script.js` 冒頭の `CONFIG` を修正します。
- 表示文言：`index.html` を修正します。
- デザイン：`style.css` を修正します。
- 札アイコン：`assets` 内の同名SVGを差し替えます。

更新後はテストケースを再実行し、GitHubへ変更をコミットしてください。

## 素材出典

札識別用の梅・竹・松・富士アイコンは、[ICOOON MONO](https://icooon-mono.com/)（著作権：TopeconHeroes）の素材です。公式画像、公式ロゴ、ゲーム内素材は使用していません。

- [梅の花の無料アイコン](https://icooon-mono.com/10012-%E6%A2%85%E3%81%AE%E8%8A%B1%E3%81%AE%E7%84%A1%E6%96%99%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3/)
- [竹の無料素材2](https://icooon-mono.com/15371-%E7%AB%B9%E3%81%AE%E7%84%A1%E6%96%99%E7%B4%A0%E6%9D%902/)
- [松の葉の無料アイコン](https://icooon-mono.com/11771-%E6%9D%BE%E3%81%AE%E8%91%89%E3%81%AE%E7%84%A1%E6%96%99%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3/)
- [どっしりとした富士山のアイコン](https://icooon-mono.com/11763-%E3%81%A9%E3%81%A3%E3%81%97%E3%82%8A%E3%81%A8%E3%81%97%E3%81%9F%E5%AF%8C%E5%A3%AB%E5%B1%B1%E3%81%AE%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3/)
- [ICOOON MONO ライセンス](https://icooon-mono.com/license/)

## 非公式ツールについて

本ツールは『刀剣乱舞ONLINE』の非公式ファンツールです。公式運営および関係各社とは関係ありません。

ゲームの仕様変更により計算結果と実際の内容が異なる場合があります。最新のキャンペーン条件は公式情報をご確認ください。

ライセンスは未設定です。LICENSEファイルは含めていません。
