const LowerPrio = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`text-green-500 ${props.className}}`}
    {...props}
  >
    <path
      d="m18 11.842-5.301 2.79a1.5 1.5 0 0 1-1.398 0L6 11.842M18 9l-5.301 2.79a1.5 1.5 0 0 1-1.398 0L6 9"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

export default LowerPrio;
