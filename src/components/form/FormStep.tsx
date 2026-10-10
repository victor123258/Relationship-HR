import type { AnswerMap, AnswerValue, FormStepDef } from "../../types/form";
import { SectionHeading, Divider } from "../ui/Card";
import { QuestionRenderer } from "./QuestionRenderer";

export function FormStep({
  stepDef,
  answers,
  onChange,
  invalidIds,
  done,
}: {
  stepDef: FormStepDef;
  answers: AnswerMap;
  onChange: (id: string, value: AnswerValue) => void;
  invalidIds: Set<string>;
  done: boolean;
}) {
  return (
    <div>
      <SectionHeading index={stepDef.number} title={stepDef.title} done={done} />
      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{stepDef.subtitle}</p>
      <Divider className="my-5" />
      <div className="space-y-7">
        {stepDef.questions.map((q) => (
          <QuestionRenderer
            key={q.id}
            question={q}
            answers={answers}
            onChange={onChange}
            invalid={invalidIds.has(q.id)}
          />
        ))}
      </div>
    </div>
  );
}
