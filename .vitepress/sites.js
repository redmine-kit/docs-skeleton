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
        en: 'Runs Redmine on AWS serverless services: attachments in S3, mail through SES, and administration pages for the AWS side.',
        ja: 'AWS のサーバーレスのサービスで Redmine を動かすためのプラグインです。S3 の添付ファイル、SES のメール、AWS の側の管理画面を持ちます。',
      },
      {
        repo: 'redmine_github',
        name: 'Redmine GitHub',
        status: 'consideration',
        en: 'Connects GitHub repositories through a GitHub App and a shared gateway, instead of repositories on the server.',
        ja: 'サーバーのリポジトリの代わりに、GitHub のリポジトリを GitHub App と共通のゲートウェイでつなぐプラグインです。',
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
        name: 'redmine-kit/serverless',
        status: 'design',
        en: 'A design for running the latest Redmine on AWS Lambda, with Aurora DSQL, S3, SQS and SES, using Redmine Serverless.',
        ja: '最新の Redmine を、Aurora DSQL、S3、SQS、SES と Redmine Serverless を使って、AWS Lambda で動かす設計です。',
      },
    ],
  },
]

export const statusLabels = {
  design: { en: 'Design stage', ja: '設計の段階' },
  consideration: { en: 'Under consideration', ja: '検討の段階' },
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
