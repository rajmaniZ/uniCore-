
import React from "react";
import "./loader.css";

const Loader = ({ size = 120 }) => {
  return (
    <div className="loader-container">
      <svg
        className="loader-svg"
        viewBox="0 0 717 700"
        style={{ width: size }}
      >
        <defs>
          <linearGradient id="capGradient">
            <stop offset="0%" stopColor="#c850c0" />
            <stop offset="40%" stopColor="#ff6a88" />
            <stop offset="70%" stopColor="#ffb347" />
            <stop offset="100%" stopColor="#ffd93d" />
          </linearGradient>

          <linearGradient id="uGradient">
            <stop offset="0%" stopColor="#5f6cff" />
            <stop offset="40%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#43e97b" />
          </linearGradient>

          <linearGradient id="ribbonGradient">
            <stop offset="0%" stopColor="#a044ff" />
            <stop offset="100%" stopColor="#c850c0" />
          </linearGradient>
        </defs>

        {}
        <path
          id="cap"
          d="M360.5 0L4 179.5L360.5 344.5L712.5 178L360.5 0Z"
          fill="url(#capGradient)"
        />

        {}
        <path
          id="u"
          d="M124.5 271L256.5 331.5C256.5 331.5 256.365 423.292 256.5 516C256.635 608.708 461.644 620.837 461.5 516C461.356 411.163 461.5 334.5 461.5 334.5L593.498 273.501C593.453 273.567 592.5 277.793 592.5 516C592.5 760 123 762 123 516V271H124.5Z"
          fill="url(#uGradient)"
        />

        {}
        <path
          id="ribbon"
          d="M92.5477 214.556V478.922C92.5477 482.734 91.4845 484.876 89.8231 486.122C88.094 487.419 85.4983 487.922 82.0477 487.922H55.034C54.5648 487.375 54.0471 486.996 53.5585 486.696C53.264 486.516 52.9616 486.352 52.7108 486.213C52.4482 486.067 52.2276 485.939 52.0311 485.802C51.6591 485.542 51.3985 485.267 51.2284 484.846C51.0477 484.398 50.9325 483.693 51.0438 482.516C51.0935 481.991 51.3817 480.788 51.8993 478.981C52.4063 477.212 53.1066 474.952 53.9344 472.373C55.5897 467.216 57.7475 460.811 59.8758 454.562C62.0022 448.317 64.1018 442.22 65.6327 437.698C66.3983 435.437 67.0254 433.561 67.4442 432.251C67.6527 431.599 67.8129 431.074 67.9139 430.71C67.963 430.533 68.0054 430.367 68.0301 430.236C68.0402 430.183 68.06 430.075 68.0604 429.956C68.0605 429.935 68.0599 429.874 68.0477 429.792V316.396V203L92.5477 214.556Z"
          fill="url(#ribbonGradient)"
        />
      </svg>
    </div>
  );
};

export default Loader;