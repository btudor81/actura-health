import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool, defineDocuments, defineLocations} from 'sanity/presentation'
import {HomeIcon} from '@sanity/icons/Home'
import {CogIcon} from '@sanity/icons/Cog'
import {schemaTypes, SINGLETONS} from './schemaTypes'

// Publishing a change triggers a Netlify rebuild (Sanity webhook to a Netlify build
// hook). The live site updates about a minute later.
//
// "Edit on page" (Presentation) shows the edit site: the same repo built as a
// server-rendered Netlify site that reads drafts, so a click on any text opens its
// field and changes show before they are published.
const EDIT_SITE = 'https://actura-health-edit.netlify.app'

const onHomepage = defineLocations({
  select: {_id: '_id'},
  resolve: () => ({locations: [{title: 'Homepage', href: '/'}]}),
})
export default defineConfig({
  name: 'default',
  title: 'Actura Health',

  projectId: 'l8x1ig69',
  dataset: 'production',

  plugins: [
    presentationTool({
      title: 'Edit on page',
      // The edit site is locked: a Studio-made secret sent to /preview/enable sets
      // its session (src/middleware.ts).
      previewUrl: {initial: EDIT_SITE, previewMode: {enable: '/preview/enable'}},
      resolve: {
        mainDocuments: defineDocuments([{route: '/', filter: `_id == "homepage"`}]),
        locations: {homepage: onHomepage, siteSettings: onHomepage},
      },
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Homepage')
              .id('homepage')
              .icon(HomeIcon)
              .child(S.document().schemaType('homepage').documentId('homepage')),
            S.listItem()
              .title('Site settings')
              .id('siteSettings')
              .icon(CogIcon)
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // No "create new" for the singletons.
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
  },

  document: {
    // Singletons can be edited and published, never deleted, duplicated or unpublished.
    actions: (actions, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
    newDocumentOptions: (items) =>
      items.filter(({templateId}) => !SINGLETONS.includes(templateId)),
  },
})
