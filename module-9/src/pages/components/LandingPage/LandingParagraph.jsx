import React from 'react';

/**
 * LandingParagraph component displays a paragraph of text
 * that reflects on the relationship between technology, magic, and art.
 *
 * @returns {JSX.Element} A paragraph element containing the text.
 */
const LandingParagraph = () => {
  return (
    <p id="landing-paragraph" className="self-stretch mt-10 text-stone-500 max-md:max-w-full">
        {/* The following text explores the interconnectedness of technology, magic, and art */}
        Any sufficiently advanced Technology is indistinguishable from Magic.
        Any sufficiently advanced Magic is indistinguishable from Art.
        Any sufficiently advanced Art is indistinguishable from Technology.
        Modern Gods, for Modern Girls.
    </p>
  );
};

export default LandingParagraph;