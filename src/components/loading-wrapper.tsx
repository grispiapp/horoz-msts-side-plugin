import { CornerTopLeftIcon } from "@radix-ui/react-icons";

export const LoadingWrapper = () => {
  return (
    <div className="flex h-60 items-center justify-center">
      <CornerTopLeftIcon className="size-8 animate-spin text-primary" />
    </div>
  );
};
