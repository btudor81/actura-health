// Three pooled groups, bullets word for word from the client (round 2, 2026-10-22:
// credentials pooled so no bullet points to one person; no individual role cards). Names and photos stay
// off the public site. A ruled list (chosen over two slider layouts, 2026-10-12),
// built from the shadcn Badge: every bullet is one chip.
import { Badge } from '@/components/ui/badge';
import { Html } from '@/components/ui/html';
import { Icon } from '@/lib/icons';
import type { Homepage } from '@/lib/content';
import { flag, headline } from '@/lib/text';

export function TeamList({ team }: { team: Homepage['team'] }) {
  return (
    <section id="team" className="section section--tint" aria-labelledby="team-title">
      <div className="wrap grid gap-x-[clamp(40px,6vw,96px)] gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="grid content-start gap-5 lg:sticky lg:top-[calc(var(--nav-h)+48px)] lg:self-start">
          <p className="eyebrow">
            <span>{team.eyebrow}</span>
          </p>
          <Html as="h2" id="team-title" html={headline(team.headline)} />
          <Html as="p" className="lead" html={flag(team.sub)} />
        </div>

        <ul className="border-t border-border">
          {team.groups.map((group, index) => (
            <li
              key={group.title}
              className="reveal grid grid-cols-1 items-start gap-x-5 gap-y-4 border-b border-border py-6 md:grid-cols-[auto_minmax(0,1fr)]"
              style={{ ['--i' as string]: index % 3 }}
            >
              <span className="tile">
                <Icon name={group.icon} />
              </span>
              <div className="flex flex-col gap-3.5">
                <h3 className="pt-0.5 text-lg">{group.title}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((credential) => (
                    <li key={credential}>
                      <Badge variant="outline" className="items-start">
                        <Icon name="check" size={18} stroke={2.25} className="mt-0.5 text-navy" />
                        <Html html={flag(credential)} />
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TeamList;
