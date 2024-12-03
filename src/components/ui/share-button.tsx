import { Button, ButtonProps } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ShareButtonProps extends ButtonProps {
  title: string;
  text: string;
  url: string;
}
export function ShareButton(props: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: props.title,
          text: props.text,
          url: props.url
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(props.url);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  return (
    <Button
      className="bg-secondary text-primary hover:bg-secondary/80"
      {...props}
      onClick={handleShare}
    >
      {props.children || "Share"}
    </Button>
  );
}
