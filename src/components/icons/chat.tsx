export const Chat = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main chat bubble background */}
      <path
        d="M4 4C2.89543 4 2 4.89543 2 6V15C2 16.1046 2.89543 17 4 17H8L11 20V17H20C21.1046 17 22 16.1046 22 15V6C22 4.89543 21.1046 4 20 4H4Z"
        fill="#292929"
      />
      {/* Optional message line */}
      <rect x="6" y="8" width="12" height="2" rx="1" fill="#545454" />
      <rect x="6" y="12" width="8" height="2" rx="1" fill="#545454" />
    </svg>
  )
}
