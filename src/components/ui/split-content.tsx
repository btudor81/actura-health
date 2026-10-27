// Adapted from 21st.dev "Split Content Section" (felipemenezes098/content-06).
// The About photo (generic clinic stock) is gone (client change list 2026-10-19:
// licensed correctional photos only, none until approved), so the split is copy
// on one side and the values on the other.
import { Html } from '@/components/ui/html';
import { Icon } from '@/lib/icons';
import type { Homepage } from '@/lib/content';
import { flag, headline } from '@/lib/text';

export function SplitContent({ about }: { about: Homepage['about'] }) {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap grid grid-cols-1 items-start gap-x-[clamp(40px,6vw,96px)] gap-y-10 lg:grid-cols-2">
        <div className="flex w-full min-w-0 flex-col items-start gap-6">
          <p className="eyebrow">
            <span>{about.eyebrow}</span>
          </p>
          <Html as="h2" id="about-title" html={headline(about.headline)} />
          <p className="text-xl font-medium tracking-[-0.03em] text-navy">{about.tagline}</p>
          {about.body.map((paragraph) => (
            <Html key={paragraph} as="p" className="lead" html={flag(paragraph)} />
          ))}
        </div>

        <ul className="border-t border-border lg:mt-2">
          {about.values.map((value, index) => (
            <li
              key={value.title}
              className="reveal grid grid-cols-[auto_1fr] gap-4 border-b border-border py-6"
              style={{ ['--i' as string]: index % 3 }}
            >
              <span className="tick mt-0.5">
                <Icon name="check" size={16} stroke={2.5} />
              </span>
              <div>
                <h3 className="text-lg">{value.title}</h3>
                <Html as="p" className="mt-1 max-w-[56ch] text-muted-foreground" html={flag(value.text)} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default SplitContent;
