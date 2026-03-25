# Renesas ESG Monitor - Design Document

## Overview
ルネサスエレクトロニクスのサステナビリティ戦略・ESG課題を継続的にモニタリングし、競合7社とのベンチマーク比較、規制動向の追跡、AI分析による意思決定支援を提供するWebアプリ。経営層・サステナビリティチーム向けの簡潔で意思決定指向のインターフェース。

## Target Users
- 経営層・シニアマネジメント
- サステナビリティチーム
- HR・調達・法務等の関連部門

## Screen List

### 1. Dashboard（ダッシュボード）- Home Tab
- **Primary Content**: ESGスコア概要、リスクアラート、最新ニュースサマリー、アクションアイテム数
- **Functionality**: 全体のESG健全性を一目で把握。重要アラートの表示。各セクションへのクイックアクセス。
- **Layout**: 上部にルネサスESGスコアカード、中段にリスクアラートバナー、下段にクイックアクションカード群

### 2. Benchmark（ベンチマーク比較）- Tab
- **Primary Content**: ルネサス + 競合7社のESGスコア比較テーブル・チャート
- **Companies**: Renesas, TI, STMicro, NXP, onsemi, Microchip, Infineon, ADI
- **Functionality**: E/S/G個別スコア比較、総合ランキング、トレンド推移、強み・弱み分析
- **Layout**: 上部にランキングカード、中段にレーダーチャート/バーチャート、下段に詳細比較テーブル

### 3. Regulations（規制トラッカー）- Tab
- **Primary Content**: 各国・地域のESG規制動向リスト、影響度評価、対応状況
- **Regulations Tracked**: EU CSRD, SEC Climate Rules, ISSB Standards, 日本GX推進法, etc.
- **Functionality**: 規制の影響度・緊急度マトリクス、対応ステータス管理、タイムライン表示
- **Layout**: フィルタ付きリスト、影響度バッジ、期限カウントダウン

### 4. Insights（AI分析・ニュース）- Tab
- **Primary Content**: ESG関連ニュースフィード、AI要約、リスク分析レポート
- **Functionality**: 外部ニュースの自動収集・AI要約、ルネサスへの影響度分析、アクション提案
- **Layout**: ニュースカードリスト、AI分析パネル、フィルタ（E/S/G/地域）

### 5. Actions（アクションプラン）- Tab
- **Primary Content**: 対応すべきアクションアイテム、テンプレート、ワークフロー
- **Functionality**: アクションプラン作成・管理、テンプレート・チェックリスト、部門間連携状況、エグゼクティブレポート生成
- **Layout**: アクションカードリスト、進捗バー、部門タグ、AI生成レポートセクション

## Key User Flows

### Flow 1: ESG状況の把握
Dashboard → ESGスコアカード確認 → ベンチマーク比較タブで競合との位置確認

### Flow 2: 規制対応
Regulations → 新規規制アラート確認 → 影響度評価 → Actions → アクションプラン作成

### Flow 3: AI分析活用
Insights → ニュースフィード確認 → AI要約読了 → リスク分析確認 → Actions → 対応策策定

### Flow 4: エグゼクティブレポート
Actions → レポート生成 → AI要約付きエグゼクティブサマリー → 共有

## Color Choices

### Brand Colors (Renesas-inspired)
- **Primary**: `#003366` (ルネサスブルー - 信頼・安定)
- **Accent**: `#00A0E9` (ライトブルー - テクノロジー)
- **Success/E**: `#10B981` (グリーン - 環境)
- **Social/S**: `#F59E0B` (アンバー - 社会)
- **Governance/G**: `#6366F1` (インディゴ - ガバナンス)
- **Warning**: `#F97316` (オレンジ)
- **Error/Critical**: `#EF4444` (レッド)
- **Background**: `#F8FAFC` (ライトグレー)
- **Surface**: `#FFFFFF` (ホワイト)
- **Dark Background**: `#0F172A`
- **Dark Surface**: `#1E293B`

## Navigation
- Bottom Tab Bar (5 tabs): Dashboard, Benchmark, Regulations, Insights, Actions
- Stack navigation within each tab for detail screens

## Benchmark Companies Data Structure
| Company | Ticker | Country |
|---------|--------|---------|
| Renesas Electronics | 6723.T | Japan |
| Texas Instruments | TXN | USA |
| STMicroelectronics | STM | Switzerland |
| NXP Semiconductors | NXPI | Netherlands |
| ON Semiconductor | ON | USA |
| Microchip Technology | MCHP | USA |
| Infineon Technologies | IFX | Germany |
| Analog Devices | ADI | USA |
