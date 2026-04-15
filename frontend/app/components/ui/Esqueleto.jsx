import "../../../styles/ui/Esqueleto.css";

function Skeleton({ className, ...props }) {
  const classesFinais = [
    "esqueleto",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <div
      data-slot="skeleton"
      className={classesFinais}
      {...props}
    />
  );
}

export { Skeleton };
