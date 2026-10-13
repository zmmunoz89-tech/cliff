import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
};

export function UpgradeModal({
  open,
  onOpenChange,
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel = "Maybe later",
}: Props) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          {secondaryLabel}
        </Button>
        <Button
          onClick={() => {
            onPrimary();
            onOpenChange(false);
          }}
        >
          {primaryLabel}
        </Button>
      </div>
    </Modal>
  );
}
