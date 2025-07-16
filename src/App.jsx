import MovieCard from './components/MovieCard.jsx';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    }
}


const App = () => {
    const [searchTerm, setSearchTerm] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setmovieList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState();
    const [trendingMovies, setTrendingMovies] = useState([]);

    // Using useDebounce to delay the search term update by 500ms
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query = '') => {
        setLoading(true);
        setErrorMessage('');
        try {
            const endpoint = `${API_BASE_URL}${query ? `/search/movie?query=${encodeURI(query)}` : `/discover/movie?sort_by=popularity.desc`} `;

            const response = await fetch(endpoint, API_OPTIONS);

            // console.log('Response:', response);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // console.log('Fetched Movies:', data);


            if (data.Response === 'False') {
                setErrorMessage(data || 'No movies found');
                setmovieList([]);
                return;
            }

            setmovieList(data.results || []);
            // console.log('Movies:', data.Response);

            if (query && data.results.length > 0) {
                // Update search count in Appwrite database
                await updateSearchCount(query, data.results[0]);

            }

        } catch (error) {
            console.error('Error fetching movies:', error);
            setErrorMessage('Failed to fetch movies. Please try again later.');
        }
        finally {
            setLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();

            setTrendingMovies(movies);
        }
        catch (error) {
            console.error('Error loading trending movies:', error);
        }
    }
    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [searchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);
    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    {/* <img src="./hero-bg.jpg" alt="Hero Background"  />   */}

                    <h1 className="text-gradient">Movies You Love to Watch</h1>



                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />




                    <h1 className="text-white">{searchTerm}</h1>
                </header>


                    {trendingMovies.length > 0  && (

                    <section className='trending'>
                        
                        <h2 className='text-white'>Trending Movies</h2>

                        <ul>
                            {trendingMovies.map((movies ,index) => 
                            <li key={movies.$id}>
                                <p>{index + 1}</p>
                                <img src={movies.poster_url} alt={movies.title} />
                            </li>
                            )}
                        </ul>   


                    </section>

                    )}


                <section className='all-movies'>
                    <h2 className="mt-[20px]">All Movies</h2>

                    {loading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul className="text-white">
                            {movieList.map((movie =>
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>

        </main>
    )
}

export default App;