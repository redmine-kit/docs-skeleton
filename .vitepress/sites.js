/**
 * The repositories of the redmine-kit organization that the header menu and
 * the top page (redmine-kit.github.io) list. Add a repository here when it
 * gets a documentation site; every site picks it up when it is rebuilt.
 */
export const siteUrl = 'https://redmine-kit.github.io/'
export const githubOrg = 'https://github.com/redmine-kit'

export const groups = [
  {
    id: 'plugins',
    en: 'Plugins',
    ja: 'プラグイン',
    items: [
      {
        repo: 'redmine_lookbook',
        name: 'Redmine Lookbook',
        en: "Previews Redmine 7's components and pages in Lookbook, switching themes, languages and layouts, for theme authors.",
        ja: 'Redmine 7 のコンポーネントと画面を Lookbook でプレビューし、テーマ、言語、レイアウトを切り替えられる、テーマの作者のためのプラグインです。',
      },
      {
        repo: 'redmine_serverless',
        name: 'Redmine Serverless',
        status: 'design',
        en: 'Runs Redmine on AWS Lambda: the Lambda runtime, the settings that cannot work on Lambda, and the status and connections administration page.',
        ja: 'Redmine を AWS Lambda で動かすためのプラグインです。Lambda での実行、Lambda で使えない設定の固定、状態と接続の管理画面を持ちます。',
      },
      {
        repo: 'redmine_serverless_costexplorer',
        name: 'Redmine Serverless Cost Explorer',
        en: "Shows the AWS account's costs from Cost Explorer in Redmine's administration: this month, the forecast, by service and by day.",
        ja: 'AWS アカウントの費用を、Cost Explorer から Redmine の管理画面に表示するプラグインです。今月の費用、予測、サービスごと、日ごとの費用を表示します。',
      },
      {
        repo: 'redmine_serverless_s3',
        name: 'Redmine Serverless S3',
        status: 'design',
        en: 'Stores Redmine attachments in Amazon S3, with direct uploads and downloads through presigned URLs. Also works outside Lambda.',
        ja: 'Redmine の添付ファイルを Amazon S3 に置くプラグインです。アップロードとダウンロードは、署名付きの URL で S3 と直接やり取りします。Lambda 以外の環境でも使えます。',
      },
      {
        repo: 'redmine_serverless_ses',
        name: 'Redmine Serverless SES',
        status: 'design',
        en: 'Sends and receives Redmine email with Amazon SES: retries of sending, importing received mail, and addresses per project.',
        ja: 'Redmine のメールを Amazon SES で送受信するプラグインです。送信のやり直し、受け取ったメールの取り込み、プロジェクトごとのアドレスを持ちます。',
      },
      {
        repo: 'redmine_serverless_sqs',
        name: 'Redmine Serverless SQS',
        status: 'design',
        en: "Runs Redmine's background jobs on Amazon SQS: the settings of aws-activejob-sqs, records of failed jobs, and resending.",
        ja: 'Redmine のバックグラウンドのジョブを Amazon SQS で動かすプラグインです。aws-activejob-sqs の設定、失敗したジョブの記録、送り直しを持ちます。',
      },
      {
        repo: 'redmine_serverless_ssm',
        name: 'Redmine Serverless SSM',
        en: 'Loads settings and secrets from AWS Systems Manager Parameter Store into environment variables before Rails starts.',
        ja: 'Rails が起動する前に、AWS Systems Manager Parameter Store から設定と秘密の値を環境変数に読み込むプラグインです。',
      },
      {
        repo: 'redmine_issue_template',
        name: 'Redmine Issue Template',
        en: "Issue templates like GitHub's: a template chooser for New issue, Markdown templates and issue forms, synced from .redmine/ in the project's repository.",
        ja: 'GitHub と同じチケットのテンプレートを使えるようにするプラグインです。「新しいチケット」での選択画面、Markdown のテンプレートとフォームを持ち、プロジェクトのリポジトリの .redmine/ から同期します。',
      },
      {
        repo: 'redmine_github',
        name: 'Redmine GitHub',
        status: 'consideration',
        en: 'Connects GitHub repositories through a GitHub App and a shared gateway, instead of repositories on the server.',
        ja: 'サーバーのリポジトリの代わりに、GitHub のリポジトリを GitHub App と共通のゲートウェイでつなぐプラグインです。',
      },
      {
        repo: 'redmine_help',
        name: 'Redmine Help',
        en: "Turns the header's Help link into help for the current screen, in the user's language, from the Redmine guide, other plugins' help and the operator's pages.",
        ja: 'ヘッダーの「ヘルプ」を、いま開いている画面のヘルプに変えるプラグインです。Redmine のガイド、ほかのプラグインのヘルプ、運用者のページを、ユーザーの言語で表示します。',
      },
    ],
  },
  {
    id: 'projects',
    en: 'Projects',
    ja: 'プロジェクト',
    items: [
      {
        repo: 'serverless',
        name: 'Serverless',
        status: 'design',
        en: 'A design for running the latest Redmine on AWS Lambda, with RDS for PostgreSQL, S3, SQS and SES, using the Redmine Serverless plugins.',
        ja: '最新の Redmine を、RDS for PostgreSQL、S3、SQS、SES と Redmine Serverless のプラグインを使って、AWS Lambda で動かす設計です。',
      },
      {
        repo: 'design-guide',
        name: 'Redmine Design Guide',
        en: "How Redmine 7's own screens are built, for plugin screens that follow core, and how Redmine 7 applies a theme, with a checklist for theme authors.",
        ja: 'Redmine 7 の画面の作りを、本体に倣うプラグインの画面のためにまとめたガイドです。Redmine 7 がテーマを適用する仕組みと、テーマの作者のためのチェックリストもあります。',
      },
      {
        repo: 'redmine-guide',
        name: 'Redmine Guide',
        en: "The Redmine guide from redmine.org as Markdown, with translations and a map from Redmine's screens to its topics, for Redmine Help.",
        ja: 'redmine.org の Redmine のガイドを Markdown にし、翻訳と、Redmine の画面からトピックへの対応表を付けたものです。Redmine Help が使います。',
      },
    ],
  },
]

/**
 * The organization's sponsors, for <Sponsors /> on the top page of the
 * organization's site (redmine-kit.github.io). The logos are in theme/assets.
 */
export const sponsors = {
  // Sponsors every project of the organization
  keyselect: { name: 'KEY SELECT', url: 'https://www.keyselect.co.jp/' },
  // Sponsors the projects tested on LocalStack
  localstack: { name: 'LocalStack', url: 'https://localstack.cloud' },
}

export const statusLabels = {
  design: { en: 'Design stage', ja: '設計段階' },
  consideration: { en: 'Under consideration', ja: '検討段階' },
}

/** The documentation site of a repository (its Japanese pages for `ja`), or null. */
export const docsUrl = (item, lang = 'en') =>
  item.docs === false ? null : `${siteUrl}${item.repo}/${lang === 'ja' ? 'ja/' : ''}`

export const githubUrl = (item) => `${githubOrg}/${item.repo}`

/** llms.txt of a documentation site, for AI tools. */
export const llmsUrl = (item, lang = 'en') => {
  const docs = docsUrl(item, lang)
  return docs ? `${docs}llms.txt` : null
}

/** The list as Markdown, for the Markdown version of the top page and llms.txt. */
export function sitesMarkdown(lang = 'en', groupId = undefined) {
  return groups
    .filter((group) => !groupId || group.id === groupId)
    .map((group) => {
      const lines = group.items.map((item) => {
        const status = item.status ? ` (${statusLabels[item.status][lang]})` : ''
        const docs = docsUrl(item, lang)
        const links = [docs && `[${lang === 'ja' ? 'ドキュメント' : 'Documentation'}](${docs})`, `[GitHub](${githubUrl(item)})`]
          .filter(Boolean).join(', ')
        return `- **${item.name}**${status}: ${item[lang] ?? item.en} ${links}`
      })
      return (groupId ? '' : `### ${group[lang] ?? group.en}\n\n`) + lines.join('\n')
    })
    .join('\n\n') + '\n'
}

/** The ids of <Sponsors ids="a b">, or every sponsor without the attribute. */
export const sponsorIds = (ids) => (ids ? ids.split(/[\s,]+/).filter((id) => sponsors[id]) : Object.keys(sponsors))

/** The sponsors as a Markdown list, for the Markdown version of the top page. */
export const sponsorsMarkdown = (ids) => sponsorIds(ids)
  .map((id) => `- [${sponsors[id].name}](${sponsors[id].url})`)
  .join('\n') + '\n'
