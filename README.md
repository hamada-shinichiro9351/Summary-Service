# 📝 URL 1行要約サービス

Google Gemini AIを使用して、URLの内容を1行（50文字以内）で要約するWebアプリケーションです。


## ✨ 主な機能

- 🔗 **URL入力**: ウェブページのURLを入力して内容を取得
- 🤖 **AI要約**: Google Gemini AIによる自動要約（1行50文字以内）
- 🎨 **モダンUI**: 美しいグラデーションとガラスモーフィズムデザイン
- 📱 **レスポンシブ**: スマートフォン、タブレット、デスクトップに対応
- ⚡ **高速処理**: 複数のプロキシサービスによる安定したURL取得
- 🛡️ **エラーハンドリング**: 包括的なエラー処理とユーザーフレンドリーなメッセージ

## 🚀 デモ

1. ブラウザで`index.html`を開く
2. 要約したいウェブページのURLを入力（例：`https://example.com`）
3. 「要約する」ボタンをクリック
4. 数秒後に1行の要約結果が表示される

## 🛠️ セットアップ手順

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

**例：**
```javascript
const GEMINI_API_KEY = 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

### 3. アプリケーションの実行

1. `index.html`ファイルをブラウザで開く
2. URLを入力して「要約する」ボタンをクリック
3. 要約結果が表示されます

## 📁 ファイル構成

```
1行要約/
├── index.html              # メインHTMLファイル
├── style.css               # CSSスタイル（ガラスモーフィズムデザイン）
├── script.js               # JavaScript機能（Gemini API連携）
├── README.md               # このファイル
└── url_summary_service.png # プロジェクト画像
```

## 🔧 技術仕様

### フロントエンド
- **HTML5**: セマンティックなマークアップ
- **CSS3**: モダンなグラデーションとガラスモーフィズム効果
- **JavaScript (ES6+)**: 非同期処理とAPI連携

### AI・API
- **Google Gemini Pro**: 高精度な自然言語処理
- **AllOrigins**: CORS回避用プロキシサービス
- **複数プロキシ**: 安定したURL取得のためのフォールバック機能

### デザイン
- **ガラスモーフィズム**: 半透明効果とブラー処理
- **グラデーション**: 美しい背景グラデーション
- **レスポンシブ**: 全デバイス対応
- **アニメーション**: スムーズなホバー効果とトランジション

## 📖 使用方法

### 基本的な使い方
1. ブラウザで`index.html`を開く
2. 要約したいウェブページのURLを入力
3. 「要約する」ボタンをクリック
4. 数秒後に1行の要約結果が表示される

### 入力形式
- **必須**: `http://` または `https://` で始まるURL
- **例**: `https://www.example.com/article`

### 出力形式
- **文字数**: 50文字以内の1行要約
- **言語**: 日本語
- **形式**: 簡潔で分かりやすい要約文

## ⚠️ 注意事項

### セキュリティ
- **APIキー保護**: Google Gemini APIキーは公開しないよう注意
- **HTTPS推奨**: 本番環境ではHTTPSでの運用を推奨

### 制限事項
- **CORS制限**: 一部のウェブサイトでは取得できない場合があります
- **API制限**: Google Gemini APIの利用制限に注意
- **ネットワーク**: インターネット接続が必要です

## 🔍 トラブルシューティング

### APIキーエラー
```
エラー: API エラー: API key not valid
```
**解決方法:**
- APIキーが正しく設定されているか確認
- APIキーが有効か確認
- Google AI StudioでAPIキーの状態を確認

### URL取得エラー
```
エラー: URLの内容を取得できませんでした
```
**解決方法:**
- URLが正しい形式か確認（`https://`で始まる）
- そのURLがアクセス可能か確認
- 別のURLで試行

### 要約エラー
```
エラー: AIによる要約に失敗しました
```
**解決方法:**
- インターネット接続を確認
- しばらく時間をおいて再試行
- APIキーの利用制限を確認

## 🎯 特徴的な機能

### 複数プロキシ対応
- AllOrigins
- CORS Anywhere
- ThingProxy
- フォールバック機能で安定したURL取得

### スマートな要約
- 内容が取得できない場合はURLから推測
- 50文字以内の簡潔な要約
- 日本語での自然な表現

### ユーザー体験
- リアルタイムバリデーション
- ローディングアニメーション
- エラーメッセージの詳細表示

## 🤝 貢献

このプロジェクトへの貢献を歓迎します！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- [Google Gemini AI](https://ai.google.dev/) - AI要約機能
- [AllOrigins](https://allorigins.win/) - CORS回避サービス
- その他のオープンソースプロジェクト

---

**開発者**: [Your Name]  
**バージョン**: 1.0.0  
**最終更新**: 2024年 

