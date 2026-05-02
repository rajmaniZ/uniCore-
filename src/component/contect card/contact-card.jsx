import styles from "./contantCard.module.css";

function SocialContact() {
  return (
    <>
      {}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="uniGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6ec4" />
            <stop offset="20%" stopColor="#ff9a44" />
            <stop offset="40%" stopColor="#f9c449" />
            <stop offset="60%" stopColor="#4cd964" />
            <stop offset="80%" stopColor="#5ac8fa" />
            <stop offset="100%" stopColor="#5856d6" />
          </linearGradient>
        </defs>
      </svg>

      <div className={styles.socialIcons}>
        {}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <svg width="40" height="40" viewBox="0 0 24 24" className="icons">
            <path
              fill="url(#uniGradient)"
              d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12H17l-.4 3h-2.6v7A10 10 0 0 0 22 12"
            />
          </svg>
        </a>

        {}
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <svg width="40" height="40" viewBox="0 0 24 24" className="icons">
            <path
              fill="url(#uniGradient)"
              d="M22 5.9c-.8.4-1.6.6-2.5.8a4.3 4.3 0 0 0 1.9-2.4c-.8.5-1.8.9-2.8 1.1A4.3 4.3 0 0 0 12 8.6c0 .3 0 .6.1.9A12.2 12.2 0 0 1 3 4.9a4.3 4.3 0 0 0 1.3 5.7c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.8 3.3 4.2-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1a4.3 4.3 0 0 0 4 3A8.6 8.6 0 0 1 2 19.5a12.1 12.1 0 0 0 6.6 2c7.9 0 12.2-6.6 12.2-12.2v-.6c.8-.6 1.5-1.3 2-2.1z"
            />
          </svg>
        </a>

        {}
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <svg width="40" height="40" viewBox="0 0 24 24" className="icons">
            <path
              fill="url(#uniGradient)"
              d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm4.75-2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"
            />
          </svg>
        </a>

        {}
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <svg width="40" height="40" viewBox="0 0 24 24" className="icons">
            <path
              fill="url(#uniGradient)"
              d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4zM8 8h3.8v2.2h.1c.5-1 1.9-2.2 3.9-2.2 4.2 0 5 2.8 5 6.5V24h-4v-7.5c0-1.8 0-4-2.5-4s-2.9 1.9-2.9 3.9V24H8z"
            />
          </svg>
        </a>
      </div>
    </>
  );
}

export default SocialContact;