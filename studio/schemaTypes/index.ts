import {homepage} from './homepage'
import {siteSettings} from './siteSettings'

export const schemaTypes = [homepage, siteSettings]

// One document each, fixed ids. The seed and the site query read these ids.
export const SINGLETONS = ['homepage', 'siteSettings']
