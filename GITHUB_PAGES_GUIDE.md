# GitHub Pages 公開手順

2026年9月5日時点のGitHub公式ドキュメントを確認した手順です。この作業を行うとサイトが一般公開されます。

## 1. Publicリポジトリを作る

1. GitHubへログインします。
2. 右上の「＋」から「New repository」を選びます。
3. リポジトリ名を入力します。例：`tourabu-tanto-ceiling-calculator`
4. 公開範囲は「Public」を選びます。
5. 「Create repository」を押します。

## 2. 完成ファイルをアップロードする

1. 作成したリポジトリの「Add file」→「Upload files」を開きます。
2. ZIPを展開し、`index.html` がリポジトリ直下に来るよう、中身をすべてアップロードします。
3. `Commit changes` を押し、`main` ブランチへ保存します。

注意：ZIPファイル自体を置くだけでは公開できません。必ず展開したファイルをアップロードしてください。

## 3. GitHub Pagesを有効にする

1. リポジトリ上部の「Settings」を開きます。
2. 左側の「Code and automation」内にある「Pages」を選びます。
3. 「Build and deployment」の「Source」で「Deploy from a branch」を選びます。
4. 「Branch」で `main` を選びます。
5. フォルダは `/(root)` を選びます。
6. 「Save」を押します。

## 4. 公開URLを確認する

反映後、Pages設定画面に公開URLが表示されます。Project Siteの一般的なURLは次の形式です。

`https://ユーザー名.github.io/リポジトリ名/`

公開直後は反映に少し時間がかかる場合があります。CSSやアイコンを含む全パスは相対パスで設定済みなので、Project Siteのサブディレクトリでも動作します。

## 更新する場合

同じリポジトリの `main` ブランチへ変更ファイルをアップロードし、コミットします。公開元に新しいコミットが反映されると、GitHub Pagesが再公開します。

## 公式情報

- [GitHub Pages の公開元を設定する（GitHub Docs）](https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

公式ドキュメントでは、ブランチから公開する場合に「Deploy from a branch」を選び、公開元のブランチと `/(root)` または `/docs` フォルダを指定する手順が案内されています。
