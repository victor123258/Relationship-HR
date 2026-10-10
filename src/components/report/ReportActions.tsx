import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, RotateCcw, Share2, Trash2 } from "lucide-react";
import type { ReportInput, ScoringResult, SharedReportPayload } from "../../types/report";
import { buildShareUrl, encodePayload } from "../../lib/url-codec";
import { generateReportPdf } from "../../lib/pdf-export";
import { copyToClipboard } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { toast } from "../ui/Toast";

export function ReportActions({
  input,
  result,
  onClearMine,
}: {
  input: ReportInput;
  result: ScoringResult;
  /** Session mode: clears this browser's applicant data. */
  onClearMine?: () => void;
}) {
  const navigate = useNavigate();
  const [clearOpen, setClearOpen] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const share = async () => {
    const payload: SharedReportPayload = {
      v: 1,
      code: input.code,
      nameA: input.nameA,
      nameB: input.nameB,
      answersA: input.answersA,
      answersB: input.answersB,
      generatedAt: input.generatedAt,
    };
    const url = buildShareUrl(`/shared/${encodePayload(payload)}`);
    const ok = await copyToClipboard(url);
    toast(ok ? "Report link copied — results encoded in URL" : "Copy failed", ok ? "success" : "warning");
  };

  const download = () => {
    setPdfBusy(true);
    try {
      generateReportPdf(input, result);
      toast("PDF downloaded");
    } catch {
      toast("PDF export failed", "warning");
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Button variant="accent" onClick={share}>
        <Share2 className="h-4 w-4" />
        Share Report
      </Button>
      <Button variant="outline" onClick={download} loading={pdfBusy}>
        <Download className="h-4 w-4" />
        Download as PDF
      </Button>
      <Button variant="outline" onClick={() => navigate("/")}>
        <RotateCcw className="h-4 w-4" />
        Start New Session
      </Button>
      {onClearMine && (
        <>
          <Button variant="ghost" onClick={() => setClearOpen(true)} className="text-slate-400 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
            Clear My Data
          </Button>
          <Modal
            open={clearOpen}
            onClose={() => setClearOpen(false)}
            title="Clear your data?"
            footer={
              <>
                <Button variant="outline" size="sm" onClick={() => setClearOpen(false)}>Cancel</Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    onClearMine();
                    setClearOpen(false);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Erase My Answers
                </Button>
              </>
            }
          >
            Your answers and submission for session <strong>{input.code}</strong> will be erased from
            this browser. Your partner's answers stay intact on their side. Since the report needs
            both applications, it will seal again until you re-apply.
          </Modal>
        </>
      )}
    </div>
  );
}
