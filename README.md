# vite-react-spa

Vite × React による SPA(CSR)の検証

## 技術構成(フロントエンド)

- TypeScript v5.1.3
- React v18.3
- Vite v5.4.0
- react-router-dom v6.26.1
- @mui/material v5.16.7
- aspida v1.14.0
- openapi2aspida v0.24.0
- swagger-merger v1.5.4
- Tailwind CSS v3.4.10
- Storybook v8.2.9
- Vitest v2.0.5
- ESLint
- Prettier
- Github Actions

## 機能

- 会員登録
- ログイン
- 読書記録の作成・編集・一覧表示

## 設計方針

### ディレクトリ設計

**【基本方針】**

- src 配下のルートディレクトリで全ページで共通して使用するものを定義
  - API 関連、共通コンポーネント、コンテキスト、カスタムフックなど
- 各ページ(ドメイン)のコンポーネントは pages ディレクトリ配下に作成
  - サブドメインごとにディレクトリを作成し、その中でページコンポーネントやそのページのみで使用するものを作成
    - API 関連、コンポーネント(専属コンポーネント)、コンテキスト、カスタムフックなど
  - サブドメインを横断して使用するものはドメインのディレクトリ直下で作成(そのドメイン内で共通して使用する専属コンポーネントなど)

<pre>
frontend
├── public...画像などasset
├── src
  ├── apis...APIの呼び出しメソッド群
  ├── components...複数のページ間で共通で使用する(共通コンポーネント Atomicデザインベース)
  ├── constants...定数置き場
    ├── navigation...ルーティング関連
  ├── contexts...複数ページ間で共通で使用するコンテキスト
  ├── generated...openapi2aspidaによるAPIクライアントと型の自動生成先
  ├── hooks...カスタムフック
  ├── pages...ページのコンポーネント
    ├── page_domain
      ├── components...そのページ(ドメイン)で共通して使用するコンポーネント(専属コンポーネント Atomicデザインベース)
      ├── contexts...そのページ(ドメイン)で共通して使用するコンテキスト
      ├── hooks...そのページ(ドメイン)で共通して使用するhooks
      ├── types...そのページ(ドメイン)で共通して使用する型定義ファイル
      ├── page_subdomain
        ├── components...そのサブドメインで共通して使用するコンポーネント(専属コンポーネント Atomicデザインベース)
        ├── index.tsx...そのサブドメインのページコンポーネント
  ├── index.css...Tailwindの使用宣言
  ├── layout.tsx...全ページで共通して使用するレイアウト
  ├── main.tsx...Reactのエントリポイント
  ├── vite-env.d.ts...環境変数
└── package.json
└── package-lock.json
└── 他configなど
└── index.html...エントリポイント
</pre>

### 状態管理
- グローバルステートを扱うものが限定的であり、そこまで高度なことは求めない
- ライブラリ依存を極力最小限にしたい(ライブラリに頼らなくて良いところは使わないように)
- Context でグローバルステートを管理し、使用箇所はページの専属コンポーネントの organisms で
- props で下位コンポーネントに渡す
- 基本はローカルステート & それを props で渡す

### コンポーネント設計
全ページで共通して使用する共通コンポーネントと各ページ(ドメイン)およびそのサブページ(サブドメイン)で使用する専属コンポーネントに分ける

- src 配下のルートディレクトリで全ページで共通して使用するもの(frontend/src/components/)...共通コンポーネント
- 各ページ(ドメイン)のみで使用するもの(frontend/src/pages/components)...専属コンポーネント
- 各ページのサブドメインのみで使用するもの(frontend/src/pages/sub_domains/components)...専属コンポーネント

## テスト方針

- コンポーネントの単体・結合テストを実装
  - フロントエンドのテストの ROI を考えて
  - リグレッションテストにもなる
  - それぞれ以下の観点でテスト
    - props が受け取れるか
    - そのコンポーネントが表示できること
    - そのコンポーネント内の動作が意図通りであること
    - 下位コンポーネントまで含め、協調動作が意図通りであること
- サービスが拡大してきたら、VRT や E2E を検討しても良い
  - VRT...Storybook × Chromatic が簡単でデザインシステムにも使える
  - E2E...Playwright が並列実行がデフォルトでできるため有力候補(Cypress でも良いが、並列実行が一定時間を超えると課金対象になる)

## API 関連

- api_server/app/swagger 配下で Swagger を元に API の仕様定義
- それをもとに frontend コンテナで以下のコマンドで API クライアントと型を自動生成

```
# api_server/app/swagger/reading_recordsディレクトリをもとにreading_recordsのドメインについて生成する
sh generate_types.sh -e reading_records

→ frontend/src/generated配下にAPIクライアントと型が生成される
```

### 参考

- Vite × React × TypeScript の Docker 環境構築
  - https://qiita.com/ayakaintheclouds/items/2f999123afb85b8b9754
- Vite の Tailwind 導入
  - https://zenn.dev/sikkim/articles/93bf99d8588e68#tailwindcss%E3%81%AE%E8%A8%AD%E5%AE%9A
- ESLint, Prettier の導入
  - https://qiita.com/Stellarium/items/095ca74299a50016c321
- Vite 絶対パス指定
  - https://qiita.com/YOLO-koki/items/dbe2ed5b3fd97cedbc7b
- MUI の導入
  - https://zenn.dev/thorie/scraps/e680501939d241
- Vitest の導入
  - https://zenn.dev/collabostyle/articles/15883dcd38c9ff
- Vitest の設定
  - https://zenn.dev/longbridge/articles/9d9ec773cb3814
- Vite の環境変数
  - https://vitejs.dev/guide/env-and-mode
  - https://zenn.dev/pyhrinezumi/articles/5d4de84af2c110
- Vite の Storybook の導入
  - https://zenn.dev/longbridge/articles/13e65ef71455e4
