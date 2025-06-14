# AI搭載 銀行取引明細書コンバーター

PDFの銀行取引明細書をAIで自動解析し、構造化されたデータに変換するWebアプリケーションです。

## 主な機能

- **PDFアップロード**: ドラッグ&ドロップまたはクリックでPDFファイルをアップロード
- **AI自動解析**: Gemini 1.5 Pro APIを使用してPDFから取引データを自動抽出
- **分割画面表示**: 元のPDFと抽出されたデータを並べて表示
- **インライン編集**: 抽出されたデータを直接編集可能
- **残高検証**: 取引データの整合性を自動チェック
- **CSVエクスポート**: カスタマイズ可能な形式でデータをエクスポート

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Gemini API キーの設定

1. [Google AI Studio](https://makersuite.google.com/app/apikey)でAPIキーを取得
2. `.env`ファイルを作成し、APIキーを設定：

```bash
cp .env.example .env
```

`.env`ファイルを編集：
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

## 使用方法

1. **ファイルアップロード**: PDFの銀行取引明細書をアップロード
2. **AI処理**: Gemini AIが自動的にデータを抽出・構造化
3. **データ確認**: 分割画面で元のPDFと抽出データを比較
4. **編集**: 必要に応じてデータを直接編集
5. **エクスポート**: CSVファイルとしてダウンロード

## 技術スタック

- **フロントエンド**: React + TypeScript + Tailwind CSS
- **AI処理**: Google Gemini 1.5 Pro API
- **ビルドツール**: Vite
- **アイコン**: Lucide React

## セキュリティ

- すべての処理はクライアントサイドで実行
- アップロードされたファイルは処理後に自動削除
- SSL/TLS暗号化通信
- APIキーは環境変数で安全に管理

## 注意事項

- Gemini APIキーが設定されていない場合、デモデータが表示されます
- PDFの形式によっては、抽出精度が異なる場合があります
- 抽出されたデータは必ず確認・検証してからご使用ください

## Deployment

This project is configured for deployment to Cloudflare Pages.

To deploy the application:

1.  **Build the project:**
    ```bash
    npm run build
    ```
2.  **Deploy to Cloudflare Pages:**
    ```bash
    npm run deploy
    ```
    This command uses `wrangler` to deploy the contents of the `./dist` directory. Ensure you have `wrangler` installed and configured (`npm install -D wrangler` is already done for this project). You will need to be logged into your Cloudflare account via `wrangler login`.
