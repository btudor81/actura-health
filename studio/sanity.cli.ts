import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'l8x1ig69',
    dataset: 'production'
  },
  studioHost: 'actura-health',
  deployment: {
    appId: 'zk71s15pui7lhqy7dghhzw0h',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: false,
  },
})
