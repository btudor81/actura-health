import {defineArrayMember, defineField, defineType, type ArrayRule} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'
import {headline, icon, line, lines, text} from './helpers'

// The homepage, one tab per section, top to bottom as on the site. Field names
// and nesting match src/content/seed/homepage.json, so the build can fall back
// to the seed with no mapping.

function section(name: string, title: string, fields: ReturnType<typeof defineField>[]) {
  return defineField({
    name,
    title,
    type: 'object',
    group: name,
    options: {collapsible: false},
    fields,
  })
}

// A repeatable card: optional icon, title, text.
function cards(
  name: string,
  title: string,
  {withIcon = true, min = 1, max}: {withIcon?: boolean; min?: number; max?: number} = {},
) {
  return defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        name: 'card',
        fields: [
          ...(withIcon ? [icon()] : []),
          line({name: 'title', title: 'Title'}),
          text({name: 'text', title: 'Text', rows: 3}),
        ],
        preview: {select: {title: 'title', subtitle: 'text'}},
      }),
    ],
    validation: (rule: ArrayRule<unknown[]>) => {
      const base = rule.required().min(min)
      return max ? base.max(max) : base
    },
  })
}

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'trust', title: 'Experience bar'},
    {name: 'problem', title: 'Challenges'},
    {name: 'services', title: 'Services'},
    {name: 'benefits', title: 'Evidence'},
    {name: 'about', title: 'About'},
    {name: 'team', title: 'Team'},
    {name: 'contact', title: 'Contact'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    section('hero', 'Hero', [
      line({name: 'eyebrow', title: 'Label above headline'}),
      headline(),
      line({name: 'tagline', title: 'Tagline'}),
      text({name: 'sub', title: 'Intro text', rows: 3}),
      defineField({
        name: 'chips',
        title: 'Highlights',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'chip',
            fields: [icon(), line({name: 'text', title: 'Text'})],
            preview: {select: {title: 'text'}},
          }),
        ],
        validation: (rule) => rule.required().min(1).max(4),
      }),
      defineField({
        name: 'loop',
        title: 'Closed-loop card',
        type: 'object',
        options: {collapsible: true, collapsed: true},
        fields: [
          line({name: 'title', title: 'Card title'}),
          line({name: 'tag', title: 'Tag'}),
          line({name: 'cycle', title: 'Cycle line'}),
          defineField({
            name: 'steps',
            title: 'Steps',
            type: 'array',
            of: [
              defineArrayMember({
                type: 'object',
                name: 'step',
                fields: [
                  icon(),
                  line({name: 'label', title: 'Label'}),
                  line({name: 'note', title: 'Note'}),
                  defineField({
                    name: 'phase',
                    title: 'PDSA phase',
                    type: 'string',
                    options: {list: ['Plan', 'Do', 'Study', 'Act'], layout: 'radio', direction: 'horizontal'},
                    validation: (rule) => rule.required(),
                  }),
                ],
                preview: {select: {title: 'label', subtitle: 'phase'}},
              }),
            ],
            validation: (rule) =>
              rule.required().length(5).error('The card is drawn for exactly 5 steps.'),
          }),
          defineField({
            name: 'rows',
            title: 'Sample rows',
            type: 'array',
            of: [
              defineArrayMember({
                type: 'object',
                name: 'row',
                fields: [
                  line({name: 'item', title: 'Item'}),
                  defineField({
                    name: 'stage',
                    title: 'Steps reached (1 to 5)',
                    type: 'number',
                    validation: (rule) => rule.required().integer().min(1).max(5),
                  }),
                ],
                preview: {select: {title: 'item', subtitle: 'stage'}},
              }),
            ],
            validation: (rule) => rule.required().min(1).max(5),
          }),
        ],
      }),
    ]),

    section('trust', 'Experience bar', [
      line({name: 'label', title: 'Label'}),
      defineField({
        name: 'items',
        title: 'Items',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'trustItem',
            fields: [
              icon(),
              text({
                name: 'text',
                title: 'Text',
                rows: 2,
                description: 'Two short lines. Press Enter between them.',
              }),
            ],
            preview: {select: {title: 'text'}},
          }),
        ],
        validation: (rule) => rule.required().min(1).max(5),
      }),
    ]),

    section('problem', 'Challenges', [
      headline(),
      text({name: 'sub', title: 'Intro text', rows: 4}),
      text({name: 'lead', title: 'Lead-in line', rows: 2}),
      line({name: 'helpLabel', title: '"How we help" label'}),
      cards('items', 'Challenges'),
      line({name: 'transition', title: 'Closing line'}),
    ]),

    section('services', 'Services', [
      line({name: 'eyebrow', title: 'Label above headline'}),
      headline(),
      text({name: 'sub', title: 'Intro text', rows: 3}),
      defineField({
        name: 'items',
        title: 'Services',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'service',
            fields: [
              icon(),
              line({name: 'title', title: 'Title'}),
              text({name: 'text', title: 'Text', rows: 3}),
              defineField({
                name: 'slug',
                title: 'Web address name',
                type: 'string',
                readOnly: true,
                description: 'Set by the developer. Used for future service pages.',
              }),
            ],
            preview: {select: {title: 'title', subtitle: 'text'}},
          }),
        ],
        validation: (rule) => rule.required().min(1),
      }),
    ]),

    section('benefits', 'Evidence', [
      headline(),
      text({name: 'sub', title: 'Intro text', rows: 2}),
      defineField({
        name: 'items',
        title: 'Evidence cards',
        description: 'Four cards. Each illustration is drawn in code and stays with its card.',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'benefit',
            fields: [
              defineField({
                name: 'visual',
                title: 'Illustration',
                type: 'string',
                readOnly: true,
                options: {list: ['read', 'path', 'contract', 'record']},
              }),
              line({name: 'title', title: 'Title'}),
              text({name: 'text', title: 'Text', rows: 3}),
            ],
            preview: {select: {title: 'title', subtitle: 'visual'}},
          }),
        ],
        validation: (rule) => rule.required().length(4),
      }),
      defineField({
        name: 'commitments',
        title: 'Commitments',
        type: 'object',
        fields: [
          line({name: 'title', title: 'Title'}),
          cards('items', 'Commitments', {max: 3}),
          text({name: 'note', title: 'Note under the commitments', rows: 3}),
        ],
      }),
    ]),

    section('about', 'About', [
      line({name: 'eyebrow', title: 'Label above headline'}),
      headline(),
      line({name: 'tagline', title: 'Tagline'}),
      lines({name: 'body', title: 'Paragraphs', rows: 4}),
      cards('values', 'Values', {withIcon: false}),
    ]),

    section('team', 'Team', [
      line({name: 'eyebrow', title: 'Label above headline'}),
      headline(),
      text({name: 'sub', title: 'Intro text', rows: 3}),
      defineField({
        name: 'groups',
        title: 'Groups',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'teamGroup',
            fields: [
              icon(),
              line({name: 'title', title: 'Title'}),
              lines({name: 'items', title: 'Points'}),
            ],
            preview: {select: {title: 'title'}},
          }),
        ],
        validation: (rule) => rule.required().min(1).max(3),
      }),
    ]),

    section('contact', 'Contact', [
      line({name: 'eyebrow', title: 'Label above headline'}),
      headline(),
      text({name: 'sub', title: 'Intro text', rows: 3}),
      text({name: 'friction', title: 'Reassurance line', rows: 2}),
      defineField({
        name: 'form',
        title: 'Form',
        type: 'object',
        fields: [
          line({name: 'name', title: 'Name field label'}),
          line({name: 'agency', title: 'Agency field label'}),
          line({name: 'email', title: 'Email field label'}),
          line({name: 'message', title: 'Message field label'}),
          line({name: 'submit', title: 'Send button label'}),
          text({name: 'privacy', title: 'Privacy note', rows: 3}),
        ],
      }),
    ]),

    defineField({
      name: 'seo',
      title: 'Search engines',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'title',
          title: 'Page title',
          type: 'string',
          description: 'Shown in the browser tab and search results. Aim for under 60 characters.',
          validation: (rule) => [rule.required(), rule.max(60).warning('Long titles get cut off in search results.')],
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          description: 'Shown under the title in search results. Aim for 120 to 160 characters.',
          validation: (rule) => [rule.required(), rule.max(170).warning('Long descriptions get cut off.')],
        }),
        defineField({
          name: 'keywords',
          title: 'Search terms',
          description:
            'Phrases people search for. These go into page data for search engines only and never show on the page, so words kept out of the visible copy can be used here.',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'keywordGroup',
              fields: [
                defineField({name: 'category', title: 'Group', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'terms', title: 'Terms', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}}),
              ],
              preview: {select: {title: 'category', terms: 'terms'}, prepare: ({title, terms}) => ({title, subtitle: (terms || []).join(', ')})},
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Homepage'})},
})
