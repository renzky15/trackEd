import Image from "next/image";

export default function TorchLogo({
  className = "w-6 h-6",
}: {
  className?: string;
}) {
  return (
    <div className="flex items-center justify-center">
      <Image
        className={className}
        src="/logo.png"
        alt="Torch Logo"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "30%", height: "auto" }}
      />
    </div>
  );
}
