const HigherPrio = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`text-red-500 ${props.className}}`}
    {...props}
  >
    <path
      d="m5 12.158 6.383-2.88a1.5 1.5 0 0 1 1.234 0L19 12.158M5 15l6.383-2.88a1.5 1.5 0 0 1 1.234 0L19 15"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

export default HigherPrio;
