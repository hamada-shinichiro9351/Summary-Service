# URL 1行要約サービス

Google Gemini AIを使用して、URLの内容を1行で要約するWebアプリケーションです。

## 機能

- URLを入力してウェブページの内容を取得
- Google Gemini AIによる自動要約（1行50文字以内）
- モダンで美しいUI
- レスポンシブデザイン対応
- エラーハンドリング

## セットアップ手順

### 1. Google Gemini APIキーの取得

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリックしてAPIキーを生成
4. 生成されたAPIキーをコピー

### 2. APIキーの設定

`script.js`ファイルを開き、以下の行を編集してください：

```javascript
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // ここに実際のAPIキーを入力
```

例：
```javascript
const GEMINI_API_KEY = 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

### 3. アプリケーションの実行

1. `index.html`ファイルをブラウザで開く
2. URLを入力して「要約する」ボタンをクリック
3. 要約結果が表示されます

## ファイル構成

```
1行要約/
├── index.html      # メインHTMLファイル
├── style.css       # CSSスタイル
├── script.js       # JavaScript機能
└── README.md       # このファイル
```

## 技術仕様

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **AI API**: Google Gemini Pro
- **プロキシサービス**: AllOrigins (CORS回避用)
- **デザイン**: モダンなグラデーションとガラスモーフィズム

## 使用方法

1. ブラウザで`index.html`を開く
2. 要約したいウェブページのURLを入力
3. 「要約する」ボタンをクリック
4. 数秒後に1行の要約結果が表示される

## 注意事項

- 有効なGoogle Gemini APIキーが必要です
- インターネット接続が必要です
- 一部のウェブサイトではCORSポリシーのため取得できない場合があります
- APIキーは公開しないよう注意してください

## トラブルシューティング

### APIキーエラー
- APIキーが正しく設定されているか確認
- APIキーが有効か確認

### URL取得エラー
- URLが正しい形式か確認
- そのURLがアクセス可能か確認

### 要約エラー
- インターネット接続を確認
- しばらく時間をおいて再試行

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。 