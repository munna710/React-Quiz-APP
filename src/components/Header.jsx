import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <div className='home'>
        <header>
        <div>
          <h1>Which Element Are You?</h1>
          <p>(based on completely random things)</p>
        </div>
        <nav>
          <Link to='/' className='links'>Home</Link>
          <Link to='/quiz' className='links'>Quiz</Link>
        </nav>
        </header>
      </div>
    </>
  );
}