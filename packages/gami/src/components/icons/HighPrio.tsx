const HighPrio = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`text-amber-500 ${props.className}}`}
    {...props}
  >
    <path
      d="m5 13 6.41-2.747a1.5 1.5 0 0 1 1.18 0L19 13"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

export default HighPrio;
