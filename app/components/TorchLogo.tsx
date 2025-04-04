import Image from "next/image";

export default function TorchLogo({
  className = "w-6 h-6",
  percent = "30%",
}: {
  className?: string;
  percent?: string;
}) {
  return (
    <Image
      className={className}
      src="/logo.png"
      alt="Torch Logo"
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: percent, height: "auto" }}
    />
  );
}
