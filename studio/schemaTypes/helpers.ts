import {defineField, defineArrayMember, type ArrayRule, type StringRule, type TextRule} from 'sanity'

// Words and phrases the client asked to keep out of visible copy (change list
// 2026-10-19). They warn, not block: the editor sees the flag and decides.
// Search terms live in SEO > Keywords, which skips these checks on purpose.
const BANNED: Array<[RegExp, string]> = [
  [/\baudit/i, '"audit" is kept out of visible copy (client rule). Use review, oversight or monitoring.'],
  [/\binmates?\b/i, '"inmate" is kept out of visible copy (client rule). Use "people in custody".'],
  [/\b(epic|cerner|oracle health)\b/i, 'EHR vendor names are kept off the site (client rule).'],
  [/book a conversation/i, 'Use "Start a conversation" (client rule).'],
  [/fixed-scope pricing|no surprise hourly billing|no vendor conflicts/i, 'This phrase was removed by the client.'],
  [/[–—]/, 'Long dashes are not used on this site. Use a comma, a colon or a full stop.'],
]

function copyCheck(value: unknown): true | string {
  if (typeof value !== 'string') return true
  for (const [pattern, message] of BANNED) {
    if (pattern.test(value)) return message
  }
  return true
}

type FieldOptions = {
  name: string
  title?: string
  description?: string
  optional?: boolean
  rows?: number
}

// Visible copy, one line.
export function line({name, title, description, optional}: FieldOptions) {
  return defineField({
    name,
    title,
    description,
    type: 'string',
    validation: (rule: StringRule) => [
      ...(optional ? [] : [rule.required().error('Needed on the site.')]),
      rule.custom(copyCheck).warning(),
    ],
  })
}

// Visible copy over several lines. A line break in a headline is the break on
// desktop; phones wrap freely.
export function text({name, title, description, optional, rows = 3}: FieldOptions) {
  return defineField({
    name,
    title,
    description,
    type: 'text',
    rows,
    validation: (rule: TextRule) => [
      ...(optional ? [] : [rule.required().error('Needed on the site.')]),
      rule.custom(copyCheck).warning(),
    ],
  })
}

export function headline(name = 'headline', title = 'Headline') {
  return text({
    name,
    title,
    rows: 2,
    description: 'Press Enter where the line should break on desktop. Phones wrap on their own.',
  })
}

// Tabler icons the site ships with (src/lib/icons.tsx). A new icon needs a code
// change there first, then it can be added to this list.
const ICONS = [
  'alert-triangle', 'archive', 'award', 'book', 'brain', 'building-bank',
  'building-hospital', 'building-skyscraper', 'calendar-event', 'calendar-user',
  'certificate', 'chart-line', 'checkup-list', 'circle-check', 'clipboard-check',
  'compass', 'database', 'device-desktop-analytics', 'eye-check', 'file-certificate',
  'file-check', 'file-search', 'file-text', 'files', 'gavel', 'heartbeat', 'link-off',
  'list-check', 'presentation', 'receipt', 'refresh', 'route', 'ruler-measure', 'scale',
  'stethoscope', 'table', 'user-check', 'users', 'writing-sign', 'zoom-check',
]

export function icon(name = 'icon') {
  return defineField({
    name,
    title: 'Icon',
    type: 'string',
    options: {list: ICONS.map((value) => ({title: value.replace(/-/g, ' '), value}))},
    validation: (rule: StringRule) => rule.required(),
  })
}

// Plain list of short lines (team credentials, about paragraphs).
export function lines({name, title, description, rows = 1}: FieldOptions) {
  return defineField({
    name,
    title,
    description,
    type: 'array',
    of: [
      defineArrayMember(
        rows > 1
          ? {type: 'text', rows, validation: (rule: TextRule) => rule.custom(copyCheck).warning()}
          : {type: 'string', validation: (rule: StringRule) => rule.custom(copyCheck).warning()},
      ),
    ],
    validation: (rule: ArrayRule<unknown[]>) => rule.required().min(1),
  })
}
