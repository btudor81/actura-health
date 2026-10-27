// One-time seed: copies src/content/seed/*.json into the two singleton documents.
//
//   npx sanity exec scripts/seed.ts --with-user-token
//
// createIfNotExists only. Once the client edits in the Studio, re-running this is a
// no-op, never an overwrite. Schema changes later go through a patch script.
import {getCliClient} from 'sanity/cli'
import {randomUUID} from 'node:crypto'
import homepage from '../../src/content/seed/homepage.json' with {type: 'json'}
import site from '../../src/content/seed/site.json' with {type: 'json'}

const client = getCliClient({apiVersion: '2025-01-01'})

// Sanity needs a _key on every object inside an array.
function withKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) =>
      item && typeof item === 'object' && !Array.isArray(item)
        ? {_key: randomUUID().slice(0, 12), ...(withKeys(item) as object)}
        : withKeys(item),
    )
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withKeys(v)]))
  }
  return value
}

// The PDF stays in public/files until the client uploads one in the Studio.
const {capabilityStatementUrl: _pdf, ...siteFields} = site

const docs = [
  {_id: 'homepage', _type: 'homepage', ...(withKeys(homepage) as object)},
  {_id: 'siteSettings', _type: 'siteSettings', ...(withKeys(siteFields) as object)},
]

const tx = client.transaction()
for (const doc of docs) tx.createIfNotExists(doc)
const result = await tx.commit()
console.log(`Seed done. ${result.results.length} document(s) checked:`, result.results.map((r) => `${r.id} (${r.operation})`).join(', '))
