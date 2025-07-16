import React from 'react'

const MovieCard = ({ movie : {id,original_language,title,poster_path,vote_average,release_date} }) => {
  return (
    <div key={id} className='movie-card'>
    <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/No-Poster.svg'} alt={title} />
    <div className='mt-4'><h3>{title}</h3>
    <div  className='content'>
        <div className='rating'>
            <img src='/reatings.svg' alt="Ratings" />
            <p> {vote_average ? vote_average.toFixed(1) : 'N/A'} </p>
        </div>
        <span>•</span>
        <p className='lang'>{original_language ? original_language: 'N/A'}</p>
        <span>•</span>
        <p className='year'>{release_date ? release_date.split('-')[0] : 'N/A' }</p>
    </div>
    </div>
    </div>
  )
}

export default MovieCard