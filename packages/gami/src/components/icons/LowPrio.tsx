const LowPrio = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`text-blue-500 ${props.className}}`}
    {...props}
  >
    <path
      d="m5 10 6.41 2.747a1.5 1.5 0 0 0 1.18 0L19 10"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

export default LowPrio;
