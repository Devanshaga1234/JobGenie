import React from 'react';
import { Helmet } from 'react-helmet'; // 
const AboutUs = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About Job Genie</h1>
      <p className="text-lg mb-4">
        Welcome to Job Genie! We're on a mission to make job hunting smarter, faster, and personalized just for you.
      </p>
      <p className="text-lg mb-4">
        Using AI, resume parsing, and customized matching algorithms, we recommend job opportunities that truly fit your skills, experiences, and aspirations.
      </p>
      <p className="text-lg mb-4">
        Whether you're in college, a recent graduate, or an experienced professional, Job Genie is here to make your job search seamless and successful.
      </p>
      <p className="text-lg mb-8">
        Thank you for trusting us with your journey. 
      </p>

      <div className="border-t pt-8 mt-8">
        <h2 className="text-3xl font-bold mb-4">Meet the Founders</h2>
        <p className="text-lg mb-4">
          Job Genie was founded by a team of passionate students from the University of Illinois Urbana-Champaign, blending technology, business, and creativity to reimagine the future of job searching.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold">Aaryan Gusain</h3>
            <p className="text-lg">
              Sophomore majoring in Computer Science with minors in Gender Studies and Classical Civilization at the University of Illinois Urbana-Champaign.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold">Devansh Agarwal</h3>
            <p className="text-lg">
              Sophomore majoring in Computer Engineering with minors in Business and Spanish at the University of Illinois Urbana-Champaign.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold">Nakul Kuppu</h3>
            <p className="text-lg">
              Sophomore majoring in Computer Science with a minor in Biology at the University of Illinois Urbana-Champaign.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
