import React from 'react';
import { X, Download, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Curriculum Vitae Preview">
      <div className="cv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cv-modal-head">
          <div>
            <span className="lab-pill">OFFICIAL RECRUITER DOSSIER // VERIFIED CV</span>
            <h3 className="cv-modal-title">Kumar Kshitij — Curriculum Vitae</h3>
          </div>
          <div className="cv-modal-actions">
            <a
              href={PROFILE.cvUrl}
              download="Kumar_Kshitij_CV.pdf"
              className="btn btn-solid btn-sm"
            >
              <Download size={15} /> Download PDF
            </a>
            <a
              href={PROFILE.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-line btn-sm"
            >
              <ExternalLink size={15} /> Open in New Tab
            </a>
            <button type="button" className="cv-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="cv-quick-highlights">
          <span className="cv-q-pill">
            <CheckCircle2 size={13} /> B.Tech CSE &amp; Comm. @ MIT Manipal (2023–2027)
          </span>
          <span className="cv-q-pill">
            <CheckCircle2 size={13} /> SWE Intern @ Schenck RoTec India (Global IT)
          </span>
          <span className="cv-q-pill">
            <CheckCircle2 size={13} /> AI Agent Developer Intern @ Deepthought
          </span>
          <span className="cv-q-pill">
            <ShieldCheck size={13} /> Board Member (Head of HR) @ The Data Alchemist
          </span>
        </div>

        <div className="cv-iframe-wrap">
          <iframe
            src={`${PROFILE.cvUrl}#toolbar=1&navpanes=0`}
            title="Kumar Kshitij CV PDF"
            className="cv-iframe"
          />
        </div>
      </div>
    </div>
  );
};

