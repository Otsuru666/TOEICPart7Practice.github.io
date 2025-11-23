# TOEIC部管理システム

週次で開催しているTOEIC部の活動記録・分析・個別最適化を行うシステムです。

## 🎯 システム概要

このシステムは以下の機能を提供します：

1. **結果データの管理** - スプレッドシートからCSVでエクスポートしたデータを一元管理
2. **個人別弱点分析** - 各メンバーの苦手な問題タイプを特定
3. **パーソナライズド推奨** - 弱点に基づいた次回の問題設定を提案
4. **統計表示** - TOEIC部全体の進捗状況を可視化

## 📁 ファイル構成

```
TOEIC部データ/
├── members.yaml           # メンバー情報
├── problems_db.json       # 生成した問題のデータベース
├── results_db.json        # 活動結果のデータベース
├── csv_template.csv       # CSV形式のテンプレート
└── README.md              # このファイル

問題生成器/
└── toeic_club.py          # 管理スクリプト
```

## 🚀 セットアップ

### 1. メンバー情報の設定

`members.yaml` を編集してメンバー情報を更新：

```yaml
members:
  - id: "member_001"
    name: "nakato"
    target_score: 800
    current_level: "上級"
    
  - id: "member_002"
    name: "メンバー2"
    target_score: 600
    current_level: "初級"
```

### 2. 必要なライブラリのインストール

```bash
pip3 install pyyaml
```

## 📝 使い方

### 基本的なワークフロー

```bash
cd "/Users/nakato/Library/Mobile Documents/iCloud~md~obsidian/Documents/Main Wherehouse/1.Private/TOEIC/問題生成器"
```

#### 1️⃣ 問題を生成

```bash
python3 generate_problem.py -p 2 -q 5 -d 中級
```

Cursorで問題を生成後、保存。

#### 2️⃣ 問題を登録

```bash
python3 toeic_club.py register-problem 130-134.md -p 2 -q 5 -d 中級
```

#### 3️⃣ TOEIC部で問題を解く

みんなで問題を解いて、結果をスプレッドシートに記録。

#### 4️⃣ 結果をCSVでエクスポート

スプレッドシートから以下の形式でCSVをダウンロード：

| session_date | session_number | facilitator | problem_file | question_number | question_type | member_id | member_name | answer | is_correct | time_spent_seconds | notes |
|--------------|----------------|-------------|--------------|-----------------|---------------|-----------|-------------|--------|------------|-------------------|-------|

CSV形式例（`csv_template.csv` 参照）：

```csv
session_date,session_number,facilitator,problem_file,question_number,question_type,member_id,member_name,answer,is_correct,time_spent_seconds,notes
2025-11-06,1,nakato,130-134.md,130,detail,member_001,nakato,A,1,45,
2025-11-06,1,nakato,130-134.md,131,inference,member_001,nakato,B,0,60,推論問題で間違えた
```

#### 5️⃣ 結果をインポート

```bash
python3 toeic_club.py import-results ~/Downloads/toeic_results.csv
```

#### 6️⃣ 分析を確認

```bash
# 個人別分析
python3 toeic_club.py analyze member_001

# 全体統計
python3 toeic_club.py stats
```

#### 7️⃣ 次回の推奨設定を確認

```bash
python3 toeic_club.py recommend member_002
```

これで、そのメンバーに最適な問題設定が提案されます！

## 🔧 コマンド詳細

### `import-results` - CSV結果をインポート

```bash
python3 toeic_club.py import-results results.csv
```

スプレッドシートからエクスポートしたCSVファイルをインポートします。

### `register-problem` - 問題を登録

```bash
python3 toeic_club.py register-problem 130-134.md -p 2 -q 5 -d 中級 -t ビジネス
```

**オプション：**
- `-p, --passages`: パッセージ数
- `-q, --questions`: 質問数
- `-d, --difficulty`: 難易度
- `-t, --topic`: トピック（任意）

### `analyze` - メンバー分析

```bash
python3 toeic_club.py analyze member_001
```

**表示内容：**
- 総問題数、正解数、正答率
- 問題タイプ別正答率
- 弱点（正答率60%未満）の特定
- 平均解答時間

### `stats` - 全体統計

```bash
python3 toeic_club.py stats
```

**表示内容：**
- 総セッション数
- 最新セッション情報
- メンバー別サマリー

### `recommend` - 推奨問題設定

```bash
python3 toeic_club.py recommend member_002
```

**提案内容：**
- 推奨難易度（正答率に基づく）
- 推奨パッセージ数
- 重点学習すべき問題タイプ
- 問題生成コマンド
- Cursor用プロンプト追加文

## 📊 問題タイプ分類

CSV記録時に使用する問題タイプ：

- `detail` - 詳細理解問題
- `inference` - 推論問題
- `vocabulary` - 語彙問題
- `purpose` - 主旨・目的問題
- `not_question` - NOT問題（該当しないものを選ぶ）
- `synonym` - 同義語問題
- `insert_sentence` - 文挿入問題
- `cross_reference` - 複数文章参照問題

## 💡 運用Tips

### 1. 効率的なデータ記録

スプレッドシートで以下のようなフォーマットを作成：

1. **セッション情報シート** - 日付、番号、ファシリテーターを記録
2. **回答結果シート** - 各問題の回答結果を記録（CSVエクスポート用）
3. **統計シート** - 自動集計用

### 2. 定期的な分析

毎回のセッション後に：

```bash
# 結果をインポート
python3 toeic_club.py import-results latest_results.csv

# 全員を分析
python3 toeic_club.py analyze member_001
python3 toeic_club.py analyze member_002
python3 toeic_club.py analyze member_003

# 次回の推奨を確認
python3 toeic_club.py recommend member_001
python3 toeic_club.py recommend member_002
python3 toeic_club.py recommend member_003
```

### 3. 個別最適化された学習

各メンバーの弱点に基づいて、次回は異なる難易度・タイプの問題を用意。

例：
- **member_001（上級）**: 推論問題が弱い → 推論重視の上級問題
- **member_002（初級）**: 語彙問題が弱い → 語彙重視の初級問題

### 4. バックアップ

定期的にデータベースをバックアップ：

```bash
cp problems_db.json problems_db_backup_$(date +%Y%m%d).json
cp results_db.json results_db_backup_$(date +%Y%m%d).json
```

## 🎓 ワークフロー例

### 週次TOEIC部の流れ

**セッション前（ファシリテーター）**

```bash
# 各メンバーの推奨を確認
python3 toeic_club.py recommend member_001
python3 toeic_club.py recommend member_002
python3 toeic_club.py recommend member_003

# バランスを考えて問題を生成
python3 generate_problem.py -p 2 -q 5 -d 中級

# Cursorで問題生成後、登録
python3 toeic_club.py register-problem 135-139.md -p 2 -q 5 -d 中級
```

**セッション中**

1. 全員で問題を解く（1問1分目安）
2. 輪番のファシリテーターが解説
3. ワイワイ議論
4. スプレッドシートに結果を記録

**セッション後**

```bash
# CSVをエクスポートしてインポート
python3 toeic_club.py import-results session_$(date +%Y%m%d).csv

# 統計を確認
python3 toeic_club.py stats

# 各自の分析を共有
python3 toeic_club.py analyze member_001
python3 toeic_club.py analyze member_002
python3 toeic_club.py analyze member_003
```

## 🔍 データ分析の見方

### 正答率による評価

- **80%以上**: 難易度を上げる
- **60-80%**: 現在のレベルを継続
- **60%未満**: 基礎を固める

### 弱点タイプへの対応

正答率60%未満の問題タイプを重点的に学習。

例：
- `inference`が弱い → 推論力を鍛える問題を増やす
- `vocabulary`が弱い → 語彙強化の問題を増やす

### 解答時間の分析

- **平均60秒以下**: 良好なペース
- **60-90秒**: 標準的なペース
- **90秒以上**: 時間がかかりすぎ→速読練習が必要

## 📈 今後の拡張予定

- [ ] Webダッシュボード（統計グラフの可視化）
- [ ] 自動問題生成（弱点に特化した問題を自動生成）
- [ ] スコア予測機能（現在の実力からTOEICスコアを予測）
- [ ] 学習記録のエクスポート（PDF、HTMLレポート）

## 🤝 貢献

TOEIC部メンバー全員で改善していきましょう！

---

**作成日**: 2025年11月6日
**バージョン**: 1.0.0

