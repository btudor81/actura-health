// Small coded illustrations for the benefit cards, one per benefit. They are
// pictures, not content: the wrapper is aria-hidden and the card copy carries
// the meaning. No figures anywhere, only labels and states.
import { PdsaTag } from '@/components/ui/loop-tracker';
import { Icon } from '@/lib/icons';

function Tick() {
  return (
    <span className="tick">
      <Icon name="check" size={14} stroke={2.5} />
    </span>
  );
}

// Same five steps and Plan-Do-Study-Act tags as the hero tracker (client round 2).
const LOOP = [
  { step: 'Standard', phase: 'Plan' },
  { step: 'Finding', phase: 'Plan' },
  { step: 'Owner and date', phase: 'Do' },
  { step: 'Re-review', phase: 'Study' },
  { step: 'Verified', phase: 'Act' },
];

export function BenefitVisual({ kind }: { kind: string }) {
  return (
    <div className={`bv bv--${kind}`} aria-hidden="true">
      {/* One finding taken round the closed loop and verified. Neutral on purpose:
          nothing on the site compares the vendor's numbers with the records
          (client change list 2026-10-19). */}
      {kind === 'read' && (
        <div className="mock bv-read">
          <div className="bv-read__head">
            <p>Medications continued at intake</p>
            <span className="bv-read__status">
              <Icon name="check" size={18} stroke={2} />
              Verified
            </span>
          </div>
          <p className="bv-read__cycle">Plan-Do-Study-Act (PDSA) cycle</p>
          <ol className="bv-read__loop">
            {LOOP.map(({ step, phase }) => (
              <li key={step}>
                <i />
                {step}
                <PdsaTag phase={phase} />
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Two steps done, the survey next. */}
      {kind === 'path' && (
        <ol className="bv-path">
          <li className="mock">
            <span className="tile">
              <Icon name="zoom-check" size={22} />
            </span>
            Gap analysis
            <Tick />
          </li>
          <li className="mock">
            <span className="tile">
              <Icon name="clipboard-check" size={22} />
            </span>
            Mock survey
            <Tick />
          </li>
          <li className="bv-path__link" />
          <li className="mock">
            <span className="tile">
              <Icon name="award" size={22} />
            </span>
            Ready for the survey
            <span className="bv-path__ring" />
          </li>
        </ol>
      )}

      {/* A contract page with the three clauses that matter pulled out of it. */}
      {kind === 'contract' && (
        <div className="bv-contract">
          <div className="mock bv-contract__sheet">
            <i />
            <i />
            <i className="is-marked" />
            <i />
            <i className="is-marked" />
            <i />
            <i />
            <i className="is-marked" />
            <i />
          </div>
          <ul className="bv-contract__pills">
            <li>
              <span>
                <Icon name="ruler-measure" size={20} />
              </span>
              Measurable requirements
            </li>
            <li>
              <span>
                <Icon name="gavel" size={20} />
              </span>
              Clear remedies
            </li>
            <li>
              <span>
                <Icon name="writing-sign" size={20} />
              </span>
              Accountable terms
            </li>
          </ul>
        </div>
      )}

      {/* One finding, dated and sourced, feeding the three places it will be read. */}
      {kind === 'record' && (
        <div className="bv-record">
          <div className="mock bv-record__finding">
            <span className="tile">
              <Icon name="file-check" size={22} />
            </span>
            <p>
              <strong>Finding</strong>
              <span>Dated, source record attached</span>
            </p>
          </div>
          <svg className="bv-record__tree" viewBox="0 0 300 44" preserveAspectRatio="none" focusable="false">
            <path d="M150 0V22M50 44V22H250V44M150 22V44" vectorEffect="non-scaling-stroke" />
          </svg>
          <ul className="bv-record__dest">
            <li>
              <span className="tile">
                <Icon name="gavel" size={22} />
              </span>
              Litigation
            </li>
            <li>
              <span className="tile">
                <Icon name="file-certificate" size={22} />
              </span>
              Consent decree
            </li>
            <li>
              <span className="tile">
                <Icon name="eye-check" size={22} />
              </span>
              Oversight body
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
