import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import {line, text} from './helpers'

// Shared details used across the site (nav, footer, contact block, buttons).
// Field names match src/content/seed/site.json.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'brand', title: 'Brand', default: true},
    {name: 'contact', title: 'Contact'},
    {name: 'buttons', title: 'Buttons'},
    {name: 'nav', title: 'Navigation'},
  ],
  fields: [
    {...line({name: 'name', title: 'Company name'}), group: 'brand'},
    {...line({name: 'tagline', title: 'Tagline'}), group: 'brand'},
    {
      ...line({
        name: 'positioning',
        title: 'Positioning line',
        description: 'Short line used in the footer.',
      }),
      group: 'brand',
    },
    {...text({name: 'disclaimer', title: 'Disclaimer', rows: 2}), group: 'brand'},
    defineField({
      name: 'url',
      title: 'Site address',
      type: 'url',
      group: 'brand',
      readOnly: true,
      description: 'Set by the developer. Used for links in search results and shares.',
    }),

    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking link',
      type: 'url',
      group: 'contact',
      description: 'Google appointment schedule link. Leave empty to hide the booking button.',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn page',
      type: 'url',
      group: 'contact',
      description: 'Shown in the contact block only. Leave empty to hide.',
    }),

    {...line({name: 'footerNavTitle', title: 'Footer menu heading'}), group: 'nav'},
    {...line({name: 'footerContactTitle', title: 'Footer contact heading'}), group: 'nav'},

    {...line({name: 'primaryCta', title: 'Main button label'}), group: 'buttons'},
    {...line({name: 'secondaryCta', title: 'Capability statement button label'}), group: 'buttons'},
    defineField({
      name: 'capabilityStatement',
      title: 'Capability statement PDF',
      type: 'file',
      group: 'buttons',
      options: {accept: 'application/pdf'},
      description:
        'Upload a new PDF to replace the one on the site. Leave empty to keep the current file.',
    }),

    defineField({
      name: 'nav',
      title: 'Menu links',
      type: 'array',
      group: 'nav',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navLink',
          fields: [
            line({name: 'label', title: 'Label'}),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
              description: 'Section anchor, for example /#services.',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
