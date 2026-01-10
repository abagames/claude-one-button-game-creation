# Novelty-Enhanced Prompt Template for Tag-Driven Game Design

## Purpose
- Generate highly novel game designs by enforcing creative constraints and automatic similarity checking
- 3-phase design process: mechanics analysis → exclusion filtering → creative synthesis
- Built-in self-assessment to prevent direct code reuse and ensure genuine innovation

## Required Inputs
- `tmp/agent_context/agent_context.md` (latest fetch using `npm run fetch-tag-snippets -- --tags "<comma separated tags>"`).
- Existing game summaries from `knowledge/games/` for similarity checking
- Current date stamp to log in `knowledge/logs/` alongside the run.

## Phase 1: Mechanics Analysis Prompt
```
あなたはアクションミニゲームを設計・実装するコーディングエージェントです。提供されたタグとコードコンテキストを分析し、まず以下のフェーズ1を実行してください。

### フェーズ1: メカニクス要約
提供されたタグごとに以下を抽出：
1. 核となる動作パターン（例：「ボタン押下でジャンプ」「重力で落下」）
2. 主要な状態変数（例：プレイヤー位置、速度、回転角）
3. 典型的な相互作用（例：衝突検出、アニメーション切り替え）

出力フォーマット：
```
# フェーズ1: メカニクス分析

## Tag Mechanics Summary
| Tag | Core Pattern | Key Variables | Interactions |
| --- | --- | --- | --- |
| player:bounce | ボタンでジャンプ、自動で落下 | pos.y, vel.y, isOnGround | 地面衝突、障害物回避 |
| field:holes | 地面に穴、落下でゲームオーバー | holes[], player.pos | 位置チェック、生存判定 |

## Dominant Game Patterns (避けるべき既存パターン)
- <既存ゲームから抽出した支配的なパターンをリスト>
- <これらのパターンの直接流用を禁止>
```
```

## Phase 2: Exclusion Filtering Prompt
```
### フェーズ2: 除外要素の明確化
既存ゲームとの差別化のため、以下の要素を**使用禁止**として設定：

#### 既存ゲームからの除外要素
- `<game1>`の勝利条件: <条件説明>
- `<game2>`のプレイヤー制御: <制御方法説明>
- `<game3>`の障害物配置: <配置パターン説明>

#### コード再利用率の制限
- 既存コード断片の直接引用: **30%以下に制限**
- 関数名・変数名の流用: **禁止（意味的に同等なものも含む）**
- ゲームループの構造: **独自設計を必須**

出力フォーマット：
```
# フェーズ2: 除外フィルタ

## Forbidden Elements
- 勝利条件: <避けるべき条件1>, <避けるべき条件2>
- 制御方式: <避けるべき制御1>, <避けるべき制御2>
- 視覚表現: <避けるべき表現1>, <避けるべき表現2>

## Code Reuse Constraints
- Maximum direct quote ratio: 30%
- Variable naming: Must be semantically distinct
- Game loop structure: Must introduce novel timing or state management
```
```

## Phase 3: Creative Synthesis Prompt
```
### フェーズ3: 創作タスク（新規ゲーム設計）
フェーズ1で抽出したメカニクスとフェーズ2の除外制約を踏まえ、**完全に新しい勝敗条件**を創出してください。

#### 必須創作要件
1. **カテゴリ横断の組み合わせ**: `player`、`field`、`weapon`、`rule`のうち最低3カテゴリから要素を選択
2. **意外性のある勝利条件**: 既存ゲームで見られない独自の成功指標を設定
3. **タグ再結合による新メカニクス**: 単一タグの流用ではなく、複数タグを接続する新処理を考案

#### 出力フォーマット（最終案）:
```
# フェーズ3: 創作提案

## Proposal Title
<独創的なゲーム名>

## Novelty Analysis
- **Primary Innovation**: <既存ゲームとの最大差分点>
- **Cross-Category Fusion**: <選択した3+カテゴリと融合方法>
- **Novel Victory Condition**: <独自の勝利条件とその革新性>

## Tag Integration Strategy
| Tag | Traditional Use | Novel Application | Connection Method |
| --- | --- | --- | --- |
| <tag1> | <従来の用途> | <この設計での新用途> | <他タグとの結合方法> |

## Game Overview
- <核となるループ説明（2-3行）>
- <リスク要因とそれに対する対策>

## Implementation Approach
### New Components (70%+ original code)
1. <新規実装が必要な処理1>
2. <新規実装が必要な処理2>

### Adapted Snippets (30% limit)
| Source Tag | Adaptation Method | Original Context → New Context |
| --- | --- | --- |
| <tag> | <改変方法> | <元用途> → <新用途> |

## Self-Assessment Checklist
- [ ] 直接コード引用率 < 30%
- [ ] 既存ゲームと明確に区別される勝利条件
- [ ] 3カテゴリ以上からの要素組み合わせ
- [ ] 新規接続コードが全体の70%以上
- [ ] 意外性・斬新さのある要素が3つ以上

## Validation Plan
- Command: `npm run verify-prototype -- --slug <slug> --mode novelty`
- Metrics: similarity_score < 0.7, reuse_ratio < 0.3, cross_category_count >= 3
```
```

## Auto-Rejection Criteria
以下の条件に該当する場合は自動的に再試行：
- 直接コード引用率が30%超過
- 既存ゲームとの類似度が70%超過
- 単一カテゴリのみからの要素選択
- 勝利条件が既存ゲームと実質的に同一

## Run Procedure
1. Phase 1実行 → mechanics analysis完了まで待機
2. Phase 2実行 → exclusion criteria設定完了まで待機
3. Phase 3実行 → full proposal生成と自己チェック
4. Auto-rejection check → 基準未達なら再試行
5. 成功時：`tmp/trials/<YYYYMMDD>-<slug>/`に保存

## Logging Requirements
- 各フェーズの実行時間と中間結果
- 自己チェック結果（pass/fail項目別）
- 再試行回数と最終的な採用理由
- 結果を `knowledge/logs/<YYYYMMDD>-novelty-prompt.md` に記録