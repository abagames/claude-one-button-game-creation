# Claude's One-Button Game Creation

[English](./README.md) | **日本語**

全ワンボタンゲームのギャラリーは [GAMES.md](./GAMES.md) を参照。

旧バージョンのドキュメントとガイドは [archive/README.md](./archive/README.md) を参照。

**🎮 モバイルファーストのゲーム開発ワークフロー**

スマートフォンでコアメカニクスを開発、PCで仕上げ

TypeScriptと[crisp-game-lib](https://github.com/abagames/crisp-game-lib)を使用したブラウザゲーム開発プロジェクト。モバイルファーストのプロトタイピング・開発ワークフローに特化している。

## 概要

本プロジェクトは**モバイルファーストのゲーム開発ワークフロー**を実現する:

- **モバイルで設計・コーディング**: [Claude Code on the web](https://www.claude.com/blog/claude-code-on-the-web)を使い、会話型AIでコアゲームメカニクスを設計・実装
- **即座のモバイルテスト**: [Netlify](https://www.netlify.com/)のブランチデプロイで実機テスト用のプレビューURLを即座に提供
- **自動化された検証**: スクリプトが品質チェック、新規性メトリクス、バランス検証を処理
- **PCでの仕上げ（推奨）**: プロダクション品質のゲームのための最終バランス調整と改良

最適な用途:

- 通勤時間のゲームアイデアプロトタイピング
- 外出先でのベースメカニクス実装
- 初期PC環境なしでのゲーム開発コンセプト学習
- モバイルファーストの開発ワークフロー実験

## モバイル開発体験

### モバイルファーストの開発が機能する理由

**Claude Code + Netlify + GitHub = 効率的なプロトタイピングワークフロー**

モバイルデバイスは長時間の詳細な技術的議論には理想的ではない。本プロジェクトはコア実装フェーズにおいて広範な自動化によってこの制限に対処する:

1. **AI駆動の設計と実装**: Claude Codeが最小限の入力からゲームメカニクスの設計、コード生成、品質検証を自律的に処理
2. **自動化された検証パイプライン**: スクリプトがコード品質、新規性メトリクス、バランスパラメータ、類似性チェックを自動検証 - 手動介入不要
3. **ブランチベースのテスト**: 各コミットがモバイルアクセス可能なユニークURLで自動Netlifyデプロイをトリガー
4. **ターミナル不要**: すべてのコマンドがClaude Codeの統合ツールで実行
5. **タッチ最適化ゲーム**: crisp-game-libのワンボタンメカニクスはモバイルプレイに最適

**主要な自動化機能:**

- タグ選択と制約検証 (`npm run generate-constraints`)
- 新規性スコアリングと類似性検出 (`npm run similarity-check`)
- 遺伝的アルゴリズムによるゲームバランス調整 (`npm run balance-game`)
- 包括的な品質評価 (`npm run verify-prototype`)
- ワンコマンドデプロイ (`npm run build:game`)

つまり、自動タグ選択を承認し、チェックポイントで簡潔なフィードバックを提供するだけで、モバイル上でプレイ可能なゲームプロトタイプを実装できる。システムがメカニクス設計、コード実装、品質検証の複雑な作業を処理する。プロダクション品質のゲームにはPCでの最終バランス調整が推奨される。

### 典型的なモバイル開発セッション

```
あなた: 「新規ゲーム開発を開始」(モバイルブラウザ上)
  ↓
フェーズ0: npm run generate-constraints による自動タグ選択
         → 提案されたタグ: player:glide, obstacle:rotating, rule:gravity
  ↓
あなた: 「承認」(または「obstacle:rotatingをobstacle:staticに変更」)
  ↓
フェーズ1: Claude Codeが承認されたタグからメカニクスを設計
         → 問題構造: 「滑空しながら重力場をナビゲート」
  ↓
あなた: 「承認」(最小限の入力のみ)
  ↓
フェーズ2: 新規性チェックとビジュアルコミュニケーション設計
  ↓
あなた: 「承認」(または軽微なフィードバック)
  ↓
フェーズ3: dev/main.tsでの実装 + 類似性チェック(<70%)
  ↓
Claude Code: ブランチにコミット&プッシュ
  ↓
Netlify: 自動デプロイ → プレビューURL
  ↓
あなた: スマートフォンでテスト → 「簡単すぎる、障害物を増やして」
  ↓
フェーズ4: Claude Codeが検証を実行し調整を適用
  ↓
ベースメカニクスが固まるまで最小限のフィードバックでフェーズ3-4を繰り返し
  ↓
フェーズ5: プルリクエスト作成、mainへマージ
  ↓
PC（任意だが推奨）: 最終バランス調整と仕上げ
  ↓
docs/へコピー → ビルド → GitHub Pagesへ公開
```

**注意:** モバイル開発ワークフローはコアゲームメカニクスの実装に焦点を当てる。ベース実装はモバイルデバイスで完全に完了できるが、より高品質な結果のために最終バランス調整と仕上げは通常PC上で行われる。自動化スクリプト（タグ選択、新規性チェック、類似性検出、バランス検証）がモバイル上で必要な会話のやり取りを最小化するため、長いメッセージの入力が実用的でないスマートフォンでもプレイ可能なゲームプロトタイプの開発が実現可能である。

## プロジェクト構造

```
.
├── dev/                  # 開発ディレクトリ(Netlifyベース)
│   ├── index.html       # 開発用ゲームエントリーポイント
│   └── main.ts          # ゲームロジック(ここに実装)
├── docs/                # GitHub Pagesディレクトリ
│   ├── index.html       # ゲームコレクションページ
│   └── [game-slug]/     # 公開済みゲーム
│       ├── index.html
│       ├── main.ts
│       └── dist/        # ビルドされたゲームアセット
├── reference/           # タグとゲームメタデータ
│   ├── tags.csv
│   └── games.csv
├── knowledge/           # コードスニペットとガイド
│   ├── tag_code_map.json
│   └── crisp-game-lib-guide.md
├── scripts/             # 検証とビルドスクリプト
├── netlify.toml         # Netlify設定
└── vite.config.ts       # Vite設定
```

## 開発ワークフロー

本プロジェクトはゲーム開発のための構造化された6フェーズワークフローに従う。詳細なワークフローのドキュメントは `CLAUDE.md` (`AGENTS.md`) と `game_generation_workflow.md` を参照。

### クイックスタート: 新規ゲーム開発

1. **設計フェーズ**: タグを選択し、制約を検証し、ゲームコンセプトを設計
2. **実装**: `dev/` ディレクトリで作業 (`dev/index.html` + `dev/main.ts`)
3. **検証**: 検証スクリプトを実行して品質と新規性を保証
4. **テスト**: ブランチにコミット・プッシュ - Netlifyが自動的にモバイルテスト用デプロイ
5. **公開**: `docs/[game-slug]/` へコピーしてGitHub Pages用にビルド
6. **クリーンアップ**: 次のゲームのため`dev/`ディレクトリを空にする

### 詳細ワークフロー(6フェーズ)

**フェーズ0: タグ選択と初期検証**

- `reference/tags.csv` と `reference/games.csv` をレビュー
- `npm run generate-constraints` でタグ検証を実行
- 新規性スコアを算出

**フェーズ1: 問題-解決構造化**

- ワンボタン制約でゲームメカニクスを設計
- コアの問題と解決策を定義

**フェーズ2: 創造的統合と新規性保証**

- 既存ゲームとの差別化を検証
- `npm run similarity-check` を実行(70%未満である必要)
- ビジュアルコミュニケーションを設計

**フェーズ3: dev/でプロトタイプ作成**

- `dev/main.ts` で実装
- TypeScript + crisp-game-lib構造に従う
- `npx tsc --noEmit dev/main.ts` で検証

**フェーズ4: 検証とバランス調整**

- `npm run verify-prototype -- --slug dev --file dev/main.ts --mode lint` を実行
- 必要に応じてGA診断とバランス調整

**フェーズ5: 最終検証と公開**

- 包括的評価: `npm run verify-prototype -- --slug dev --file dev/main.ts --mode full`
- `docs/[game-slug]/` へコピー
- ビルド: `npm run build:game -- --game [game-slug]`
- `docs/index.html` に新規ゲームリンクを追加
- `dev/` ディレクトリをクリーン

### GitHub Pagesへの公開

1. 6フェーズすべての検証を完了
2. ゲームファイルをコピー: `cp dev/index.html docs/[game-slug]/` と `cp dev/main.ts docs/[game-slug]/`
3. ゲームをビルド: `npm run build:game -- --game [game-slug]`
4. `docs/index.html` にゲームリンクを追加
5. masterへコミット・プッシュ
6. devディレクトリをクリーン: `rm -rf dev/*`
7. GitHub Pagesでゲーム公開完了

## はじめに

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動(dev/ディレクトリ)
npm run dev

# Netlifyテスト用にビルド(dev/dist/)
npm run build:dev

# GitHub Pages用に個別ゲームをビルド
npm run build:game -- --game [game-slug]

# プロダクションビルドをプレビュー
npm run preview
```

## 利用可能なスクリプト

### 開発

- `npm run dev` - `dev/` ディレクトリ用Vite開発サーバーを起動
- `npm run build:dev` - Netlify用にdevゲームをビルド(`dev/dist/`に出力)

### 検証と品質

- `npm run verify-prototype -- --slug dev --file dev/main.ts --mode [lint|sim|ga|full]` - 包括的ゲーム検証
- `npm run similarity-check -- --file dev/main.ts` - 既存ゲームとの類似性チェック
- `npm run check-style -- --file dev/main.ts` - コードスタイル準拠を検証
- `npm run simulate-game -- --file dev/main.ts` - ゲームシミュレーションを実行

### バランスとメトリクス

- `npm run balance-game -- --slug dev` - 共進化バランス調整
- `npm run calculate-novelty -- --slug dev` - 新規性メトリクスを算出
- `npm run calculate-quality -- --slug dev` - 品質スコアを算出

### タグと制約管理

- `npm run generate-constraints` - カテゴリ横断制約推奨を生成
- `npm run fetch-tag-snippets` - 選択されたタグのコードスニペットを取得

### 公開

- `npm run build:game -- --game [game-slug]` - 個別ゲームを `docs/[game-slug]/dist/` にビルド
- `npm run generate-metadata -- --slug [game-slug]` - ゲームメタデータを生成

## Netlifyセットアップ

1. GitHubリポジトリをNetlifyに接続
2. Netlifyは `netlify.toml` の設定を使用:
   - ベースディレクトリ: `dev/`
   - ビルドコマンド: `npm run build:dev`
   - 公開ディレクトリ: `dev/dist`
3. 自動プレビューデプロイ用にブランチデプロイを有効化
4. 各ブランチプッシュでユニークなプレビューURLが作成される

## GitHub Pagesセットアップ

1. `dev/` ディレクトリでゲーム開発を完了
2. ゲームを `docs/[game-slug]/` にコピー
3. ゲームをビルド: `npm run build:game -- --game [game-slug]`
4. `docs/index.html` を更新して新規ゲームへのリンクを追加
5. `docs/` ディレクトリをコミットしてGitHubへプッシュ
6. リポジトリ設定でGitHub Pagesを有効化(ソース: `docs/` フォルダ)
7. ゲームは `https://[username].github.io/[repo-name]/` で利用可能となる

## crisp-game-libについて

crisp-game-libはブラウザベースのアーケードスタイルゲームを作成するためのミニマリストJavaScriptライブラリである。以下を提供する:

- シンプルなピクセルベースグラフィックス
- 簡単な入力処理
- 組み込み物理と衝突検出
- スコアトラッキングとゲーム状態管理
