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
        status: 'early',
        en: "Previews Redmine 7's components and pages in Lookbook, switching themes, languages and layouts, for theme authors.",
        ja: 'Redmine 7 のコンポーネントと画面を Lookbook でプレビューし、テーマ、言語、レイアウトを切り替えられる、テーマの作者のためのプラグインです。',
      },
      {
        repo: 'redmine_aws',
        name: 'Redmine AWS',
        status: 'early',
        en: 'The base of the Redmine AWS plugins: the AWS item of the administration menu, the Status tab with the connection test, and the shared settings of the AWS clients. Works on any server.',
        ja: 'Redmine AWS のプラグインが共通で使うプラグインです。管理メニューの「AWS」の項目、接続テストのある「ステータス」のタブ、AWS クライアントの共通の設定を持ちます。どのサーバーでも動きます。',
      },
      {
        repo: 'redmine_aws_lambda',
        name: 'Redmine AWS Lambda',
        status: 'early',
        en: 'Runs Redmine on AWS Lambda: the Lambda runtime and the settings that cannot work on Lambda.',
        ja: 'Redmine を AWS Lambda で動かすためのプラグインです。Lambda での実行と、Lambda で使えない設定の固定を持ちます。',
      },
      {
        repo: 'redmine_aws_s3',
        name: 'Redmine AWS S3',
        status: 'early',
        en: "Stores Redmine attachments in Amazon S3. Uploads and downloads go between the browser and S3 through CloudFront, with signed URLs on Redmine's domain, so files do not pass through Redmine. Also works outside Lambda.",
        ja: 'Redmine の添付ファイルを Amazon S3 に置くプラグインです。アップロードとダウンロードは、Redmine のドメインの CloudFront の署名付き URL で、CloudFront を通して S3 とやり取りするので、ファイルは Redmine を通りません。Lambda 以外の環境でも使えます。',
      },
      {
        repo: 'redmine_aws_ses',
        name: 'Redmine AWS SES',
        status: 'early',
        en: 'Sends and receives Redmine email with Amazon SES: retries of sending, importing incoming emails, and addresses per project.',
        ja: 'Redmine のメールを Amazon SES で送受信するプラグインです。送信の再試行、受信メールの取り込み、プロジェクトごとのアドレスを持ちます。',
      },
      {
        repo: 'redmine_aws_sqs',
        name: 'Redmine AWS SQS',
        status: 'early',
        en: "Runs Redmine's background jobs on Amazon SQS: the settings of aws-activejob-sqs, records of failed jobs, and resending them.",
        ja: 'Redmine のバックグラウンドジョブを Amazon SQS で動かすプラグインです。aws-activejob-sqs の設定、失敗したジョブの記録、再送信を持ちます。',
      },
      {
        repo: 'redmine_aws_ssm',
        name: 'Redmine AWS SSM',
        status: 'early',
        en: 'Loads settings and secrets from AWS Systems Manager Parameter Store into environment variables before Rails starts.',
        ja: 'Rails が起動する前に、AWS Systems Manager Parameter Store から設定とシークレットを環境変数に読み込むプラグインです。',
      },
      {
        repo: 'redmine_aws_costexplorer',
        name: 'Redmine AWS Cost Explorer',
        status: 'early',
        en: "Shows the AWS account's costs from Cost Explorer in Redmine's administration: this month's costs, the month-end forecast, and costs by service and by day.",
        ja: 'AWS アカウントのコストを、Cost Explorer から Redmine の管理画面に表示するプラグインです。今月のコスト、月末の予測、サービス別、日別のコストを表示します。',
      },
      {
        repo: 'redmine_issue_template',
        name: 'Redmine Issue Template',
        status: 'early',
        en: "Issue templates: a template chooser for New issue, Markdown templates and YAML forms, synced from .redmine/ in the project's repository.",
        ja: 'チケットテンプレートのプラグインです。「新しいチケット」でのテンプレート選択画面、Markdown テンプレートと YAML フォームを持ち、プロジェクトのリポジトリの .redmine/ から同期します。',
      },
      {
        repo: 'redmine_github',
        name: 'Redmine GitHub',
        status: 'consideration',
        en: 'Connects GitHub repositories through a GitHub App and a shared gateway, instead of repositories on the server.',
        ja: 'サーバーのリポジトリの代わりに、GitHub のリポジトリを GitHub App と共通のゲートウェイで接続するプラグインです。',
      },
      {
        repo: 'redmine_help',
        name: 'Redmine Help',
        status: 'early',
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
        status: 'early',
        en: 'The image, infrastructure templates and deploy commands for running the latest Redmine on AWS Lambda, with RDS, S3, SQS and SES, using the Redmine AWS plugins.',
        ja: '最新の Redmine を、RDS、S3、SQS、SES と Redmine AWS のプラグインを使って、AWS Lambda で動かすためのイメージ、インフラのテンプレート、デプロイコマンドです。',
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
  // Sponsors the projects whose tests use LocalStack (repos). Their top pages
  // list it (<Sponsors />); the others pass ids="keyselect".
  localstack: {
    name: 'LocalStack',
    url: 'https://localstack.cloud',
    repos: ['redmine_aws_s3', 'redmine_aws_ses', 'redmine_aws_costexplorer', 'serverless'],
  },
}

export const statusLabels = {
  early: { en: 'Early development', ja: '開発初期' },
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
/**
 * The ids of the sponsors to show: those in `ids`, or else every sponsor, or,
 * with `repo`, the sponsors of that repository (a sponsor without `repos`
 * sponsors every one).
 */
export const sponsorIds = (ids, repo = undefined) => {
  if (ids) return ids.split(/[\s,]+/).filter((id) => sponsors[id])
  const all = Object.keys(sponsors)
  return repo ? all.filter((id) => !sponsors[id].repos || sponsors[id].repos.includes(repo)) : all
}

/** The sponsors as a Markdown list, for the Markdown version of the top page. */
export const sponsorsMarkdown = (ids) => sponsorIds(ids)
  .map((id) => `- [${sponsors[id].name}](${sponsors[id].url})`)
  .join('\n') + '\n'
