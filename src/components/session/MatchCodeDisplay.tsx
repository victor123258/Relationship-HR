import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { copyToClipboard } from "../../lib/utils";
import { buildShareUrl } from "../../lib/url-codec";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { toast } from "../ui/Toast";

export function MatchCodeDisplay({ code }: { code: string }) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const copy = async (what: "code" | "link") => {
    const text = what === "code" ? code : buildShareUrl(`/session/${code}`);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(what);
      toast(what === "code" ? "Match code copied" : "Session link copied");
      window.setTimeout(() => setCopied(null), 1800);
    } else {
      toast("Copy failed — select manually", "warning");
    }
  };

  return (
    <Card className="dot-bg p-5 text-center sm:p-6">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
        Match code
      </p>
      <div
        className="mx-auto my-3 inline-block rounded-xl border-2 border-slate-900 bg-white px-6 py-3 font-mono text-4xl font-extrabold tracking-[0.3em] text-slate-900 hard-shadow dark:border-slate-200 dark:bg-slate-950 dark:text-white sm:text-5xl"
        aria-label={`Match code ${code.split("").join(" ")}`}
      >
        {code}
      </div>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        Share this code (or the link) with your partner so you can both apply.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => copy("code")}>
          {copied === "code" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied === "code" ? "Copied" : "Copy Code"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => copy("link")}>
          {copied === "link" ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
          {copied === "link" ? "Copied" : "Copy Link"}
        </Button>
      </div>
    </Card>
  );
}
