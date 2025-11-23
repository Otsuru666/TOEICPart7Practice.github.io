# 🚀 TOEIC部管理システム - クイックスタート

すぐに使い始めるためのガイドです。

## ⚡ 初回セットアップ（3分）

### 1. メンバー情報を更新

`members.yaml` を開いて、メンバーの名前を更新：

```yaml
members:
  - id: "member_001"
    name: "nakato"  # ← ここを更新
    
  - id: "member_002"
    name: "メンバー2"  # ← ここを更新
    
  - id: "member_003"
    name: "メンバー3"  # ← ここを更新
```

### 2. PyYAMLをインストール

```bash
pip3 install pyyaml
```

**完了！** これだけでシステムが使えます。

## 📋 毎週のワークフロー

### セッション前（5分）

```bash
cd "/Users/nakato/Library/Mobile Documents/iCloud~md~obsidian/Documents/Main Wherehouse/1.Private/TOEIC/問題生成器"

# 各メンバーへの推奨を確認
python3 toeic_club.py recommend member_001
python3 toeic_club.py recommend member_002
python3 toeic_club.py recommend member_003

# 問題を生成（推奨設定を参考に）
python3 generate_problem.py -p 2 -q 5 -d 中級
```

Cursorで問題生成後：

```bash
# 問題を登録
python3 toeic_club.py register-problem 135-139.md -p 2 -q 5 -d 中級
```

### セッション中

1. 全員で問題を解く（1問1分）
2. ファシリテーターが解説
3. ワイワイ議論
4. **スプレッドシートに結果を記録**

### セッション後（3分）

スプレッドシートから以下の形式でCSVをダウンロード：

```csv
session_date,session_number,facilitator,problem_file,question_number,question_type,member_id,member_name,answer,is_correct,time_spent_seconds,notes
2025-11-13,1,nakato,135-139.md,135,detail,member_001,nakato,A,1,45,
2025-11-13,1,nakato,135-139.md,136,inference,member_001,nakato,B,0,60,推論で間違えた
```

> **問題タイプ**: `detail`, `inference`, `vocabulary`, `purpose`, `not_question`, `synonym` など

CSVをインポート：

```bash
cd "/Users/nakato/Library/Mobile Documents/iCloud~md~obsidian/Documents/Main Wherehouse/1.Private/TOEIC/問題生成器"

python3 toeic_club.py import-results ~/Downloads/toeic_session_20251113.csv
```

統計を確認：

```bash
python3 toeic_club.py stats
```

## 📊 よく使うコマンド

### 統計表示

```bash
# 全体統計
python3 toeic_club.py stats

# 個人分析
python3 toeic_club.py analyze member_001
```

### 推奨確認

```bash
# 次回の推奨設定
python3 toeic_club.py recommend member_001
```

### 問題管理

```bash
# 問題生成
python3 generate_problem.py -p 2 -q 5 -d 中級

# 問題登録
python3 toeic_club.py register-problem 130-134.md -p 2 -q 5 -d 中級
```

## 💡 Tips

### エイリアスで簡単に

`.zshrc` に追加：

```bash
alias toeic-cd='cd "/Users/nakato/Library/Mobile Documents/iCloud~md~obsidian/Documents/Main Wherehouse/1.Private/TOEIC/問題生成器"'
alias toeic='python3 toeic_club.py'
alias toeic-gen='python3 generate_problem.py'
```

使い方：

```bash
toeic-cd
toeic stats
toeic analyze member_001
toeic-gen -p 2 -q 5 -d 中級
```

### スプレッドシートのテンプレート

**列名（必須）:**
- `session_date`: セッション日（例: 2025-11-13）
- `session_number`: セッション番号（1, 2, 3...）
- `facilitator`: ファシリテーター名
- `problem_file`: 問題ファイル名（例: 130-134.md）
- `question_number`: 問題番号（130, 131, 132...）
- `question_type`: 問題タイプ（detail, inference等）
- `member_id`: メンバーID（member_001等）
- `member_name`: メンバー名
- `answer`: 選択した回答（A, B, C, D）
- `is_correct`: 正解かどうか（1=正解、0=不正解）
- `time_spent_seconds`: 解答時間（秒）
- `notes`: メモ（任意）

## 🎯 データ活用例

### 弱点克服プラン

```bash
# メンバー2の分析
python3 toeic_club.py analyze member_002
```

出力例：
```
【弱点（正答率60%未満）】
  ⚠️  inference: 30.0% (10問)
  ⚠️  vocabulary: 45.0% (8問)
```

→ 次回は推論と語彙を重点的に含む問題を生成

### 個別最適化

各メンバーの推奨設定が異なる場合、複数の問題を用意：

```bash
# 上級者向け
python3 generate_problem.py -p 3 -q 7 -d 上級

# 初級者向け  
python3 generate_problem.py -p 1 -q 4 -d 初級
```

### 進捗追跡

定期的に統計を確認：

```bash
python3 toeic_club.py stats
```

## 🆘 トラブルシューティング

### PyYAMLがない

```bash
pip3 install pyyaml
```

### ファイルが見つからない

絶対パスで実行：

```bash
cd "/Users/nakato/Library/Mobile Documents/iCloud~md~obsidian/Documents/Main Wherehouse/1.Private/TOEIC/問題生成器"
```

### CSVインポートエラー

- UTF-8エンコーディングで保存されているか確認
- 必須列がすべて含まれているか確認
- `csv_template.csv` を参照

## 📚 さらに詳しく

詳細は `README.md` をご覧ください。

---

**Have fun learning together! 🎓✨**

