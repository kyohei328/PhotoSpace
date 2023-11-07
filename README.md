# 📸 PhotoSpace（フォトスペース）

## ■サービス概要

写真をシェアしたいが画質低下が懸念される人と
写真技術を学習するための参考写真を探す人に向けて
高品質な写真の共有と写真技術の学習、交流を促進するサービスです。

## ■想定されるユーザー層

写真を作品としてシェアしたい人  
写真を上達させたい人

## ■サービスコンセプト

SNS上で綺麗な写真を見て自分も同じように写真を撮りたいと思うが、その写真を撮影したときのカメラ設定や撮影方法も一緒に投稿していることは殆どないため、
写真と一緒に投稿することで、自分や写真技術を学びたい人の参考となるような写真のシェアサービスを考案しました。
私は写真撮影が趣味で、写真上達のために他の人が撮影した写真を見て参考にすることがあります。参考にする写真にカメラ設定や撮影方法が記載されていないため、
再現することが困難であることが多く、写真を撮るための情報があるといいなと思いがありました。また、旅行先で撮った写真など、綺麗に撮れている写真をSNSにアップしますが、
アップされた写真を見ると画質が低下しており、勿体ないなと感じることがあります。
PhotoSpaceでは、上記の課題を解決するため、高品質な写真の共有と写真技術の学習、交流が出来るサービスにしていきたいと考えています。

## ■実装を予定している機能

### MVP
- 会員登録
- ログイン
- 写真一覧
  - 写真アイコン
- 写真登録（バックグランド処理）
  - 写真
  - 作品名
  - 作品説明
  - 撮影場所
  - カメラ設定
  - 撮影機材
  - タグ
  - カテゴリー
  - その他
- 写真詳細
- お気に入り機能
- SNSシェア機能
- 検索機能(マルチ検索)
  - 場所（地図表示）
  - タグ
  - カテゴリー
  - 撮影者
- コンテスト機能
  - お題に対して写真を投稿
  - ユーザーがレビューしてランキングを付ける


### 本リリース
- 写真添削機能
  - チャットでやり取り
- カテゴリー機能
- タグ機能
- コメント機能


## ■主な使用技術
### フロントエンド
- React
- TypeScript
- TailwindCSS
### バックエンド
- Ruby on Rails(APIモード)
### インフラ
- AWS
  - ECR
  - ECS
  - S3
  - Route53
  - RDS
### CI/CD
- GitHub Actions
  
## ■画面遷移図
https://www.figma.com/file/BRIB1GcmqPXe7gHB2qOCk9/PhotoSpace_%E7%94%BB%E9%9D%A2%E9%81%B7%E7%A7%BB%E5%9B%B3?type=design&node-id=0%3A1&mode=design&t=cfkXJIrYFDj9hUFI-1

## ■ER図
![image](https://github.com/kyohei328/PhotoSpace/assets/125413388/548fcddf-13db-4224-b048-c892121941d1)
