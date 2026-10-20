import React, { useState } from 'react';
import { useDealflow } from '../../context/DealflowContext';
import { DealStage, PriorityLevel } from '../../types/mna';
import { formatCurrency } from '../../utils/financialFormulas';
import { 
  Columns3, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  MessageSquare, 
  Plus, 
  Calendar, 
  User, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PIPELINE_STAGES: { stage: DealStage; label: string; color: string }[] = [
  { stage: 'Longlist', label: '1. Longlist Discovery', color: 'rgba(148, 163, 184, 0.4)' },
  { stage: 'Screening', label: '2. Preliminary Screen', color: 'rgba(56, 189, 248, 0.4)' },
  { stage: 'Initial DD & Valuation', label: '3. Initial DD & Model', color: 'rgba(139, 92, 246, 0.4)' },
  { stage: 'IOI Submitted', label: '4. Non-Binding IOI', color: 'rgba(245, 158, 11, 0.4)' },
  { stage: 'Confirmatory DD', label: '5. Confirmatory DD & LOI', color: 'rgba(236, 72, 153, 0.4)' },
  { stage: 'Closing & SPA', label: '6. Negotiation & Closing', color: 'rgba(16, 185, 129, 0.6)' },
];

export const DealPipelineKanban: React.FC = () => {
  const { 
    pipeline, 
    targets, 
    updateDealStage, 
    updateDealPriority, 
    addDealNote, 
    removeFromPipeline, 
    setSelectedTarget 
  } = useDealflow();

  const [activeNoteInputDealId, setActiveNoteInputDealId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleMoveStage = (dealId: string, currentStage: DealStage, direction: 'prev' | 'next') => {
    const currentIndex = PIPELINE_STAGES.findIndex((s) => s.stage === currentStage);
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < PIPELINE_STAGES.length) {
      const nextStage = PIPELINE_STAGES[targetIndex].stage;
      updateDealStage(dealId, nextStage);

      // Trigger celebration if reaching Closing & SPA
      if (nextStage === 'Closing & SPA') {
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
          });
        } catch (e) {
          // ignore
        }
      }
    }
  };

  const handleSaveNote = (dealId: string) => {
    if (noteText.trim()) {
      addDealNote(dealId, noteText.trim());
      setNoteText('');
      setActiveNoteInputDealId(null);
    }
  };

  const getPriorityBadgeClass = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Critical': return 'badge-rose';
      case 'High': return 'badge-amber';
      case 'Medium': return 'badge-cyan';
      default: return 'badge-gray';
    }
  };

  return (
    <div style={{ maxWidth: '1700px', margin: '0 auto', padding: '24px', width: '100%' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>M&A Dealflow Pipeline</h1>
            <span className="badge badge-emerald">{pipeline.length} Active Workstreams</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Underwriting workflow kanban from initial discovery through preliminary due diligence, non-binding IOI, and final closing.
          </p>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(280px, 1fr))',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '20px',
        minHeight: '650px',
      }}>
        {PIPELINE_STAGES.map((col, colIdx) => {
          const dealsInStage = pipeline.filter((d) => d.stage === col.stage);
          const stageTotalEv = dealsInStage.reduce((acc, d) => acc + d.expectedValuationM, 0);

          return (
            <div
              key={col.stage}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                maxHeight: '800px',
              }}
            >
              {/* Column Header */}
              <div style={{
                padding: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                borderTop: `3px solid ${col.color}`,
                borderTopLeftRadius: 'var(--radius-lg)',
                borderTopRightRadius: 'var(--radius-lg)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff' }}>
                    {col.label}
                  </span>
                  <span style={{
                    fontSize: '0.725rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}>
                    {dealsInStage.length}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.725rem',
                  color: 'var(--text-subtle)',
                  marginTop: '4px',
                  fontFamily: 'var(--font-mono)',
                }}>
                  Value: {formatCurrency(stageTotalEv)}
                </div>
              </div>

              {/* Deal Cards Container */}
              <div style={{
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflowY: 'auto',
                flex: 1,
              }}>
                {dealsInStage.map((deal) => {
                  const target = targets.find((t) => t.id === deal.targetId);
                  if (!target) return null;

                  return (
                    <div
                      key={deal.id}
                      className="glass-panel"
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-hover)',
                        background: '#0f172a',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {/* Top row: Priority & Code Name */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className={`badge ${getPriorityBadgeClass(deal.priority)}`}>
                          {deal.priority}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--accent-cyan)',
                          fontWeight: 700,
                        }}>
                          {target.codeName}
                        </span>
                      </div>

                      {/* Target Name & EV */}
                      <div>
                        <h4
                          onClick={() => setSelectedTarget(target)}
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>{target.name}</span>
                          <ExternalLink size={12} color="var(--accent-cyan)" />
                        </h4>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--accent-emerald)',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          marginTop: '2px',
                        }}>
                          Target EV: {formatCurrency(deal.expectedValuationM)}
                        </div>
                      </div>

                      {/* Lead & Milestone */}
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                          <User size={11} color="var(--text-subtle)" />
                          <span>{deal.dealLead}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={11} color="var(--text-subtle)" />
                          <span>Target: {deal.targetClosingDate}</span>
                        </div>
                      </div>

                      {/* Next Milestone Box */}
                      <div style={{
                        background: '#0b1120',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        color: 'var(--text-subtle)',
                        lineHeight: 1.35,
                      }}>
                        <strong style={{ color: 'var(--text-main)' }}>Next: </strong>
                        {deal.nextMilestone}
                      </div>

                      {/* Notes count & Expand */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                        <span
                          onClick={() => setActiveNoteInputDealId(activeNoteInputDealId === deal.id ? null : deal.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--accent-cyan)' }}
                        >
                          <MessageSquare size={11} />
                          {deal.notes.length} notes
                        </span>

                        <button
                          onClick={() => removeFromPipeline(deal.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-subtle)',
                            cursor: 'pointer',
                            padding: '2px',
                          }}
                          title="Archive Deal"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Add note inline form */}
                      {activeNoteInputDealId === deal.id && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          <input
                            type="text"
                            placeholder="Add underwriting note..."
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="input-text"
                            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveNote(deal.id)}
                          />
                          <button
                            onClick={() => handleSaveNote(deal.id)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      )}

                      {/* Stage Move Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '8px',
                        marginTop: '4px',
                      }}>
                        <button
                          onClick={() => handleMoveStage(deal.id, deal.stage, 'prev')}
                          disabled={colIdx === 0}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 8px', opacity: colIdx === 0 ? 0.3 : 1 }}
                          title="Move to previous stage"
                        >
                          <ChevronLeft size={13} />
                        </button>

                        <span style={{ fontSize: '0.675rem', color: 'var(--text-subtle)' }}>
                          Stage {colIdx + 1} of 6
                        </span>

                        <button
                          onClick={() => handleMoveStage(deal.id, deal.stage, 'next')}
                          disabled={colIdx === PIPELINE_STAGES.length - 1}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '3px 8px', opacity: colIdx === PIPELINE_STAGES.length - 1 ? 0.3 : 1 }}
                          title="Advance to next deal stage"
                        >
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {dealsInStage.length === 0 && (
                  <div style={{
                    padding: '30px 16px',
                    textAlign: 'center',
                    color: 'var(--text-subtle)',
                    fontSize: '0.775rem',
                    fontStyle: 'italic',
                  }}>
                    No targets in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
