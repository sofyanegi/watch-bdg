import Link from 'next/link';

export default function MapButton() {
  return (
    <Link href="/maps">
      <button className="px-4 py-2 bg-primary text-primary-foreground rounded flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor" // Uses `text-primary-foreground`
          className="size-6 text-black dark:text-white"
        >
          <path
            d="M12 6H12.01M9 20L3 17V4L5 5M9 20L15 17M9 20V14M15 17L21 20V7L19 6M15 17V14M15 6.2C15 7.96731 13.5 9.4 12 11C10.5 9.4 9 7.96731 9 6.2C9 4.43269 10.3431 3 12 3C13.6569 3 15 4.43269 15 6.2Z"
            stroke="currentColor" // Uses inherited text color
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </Link>
  );
}
