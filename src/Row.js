import movieTrailer from 'movie-trailer';
import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import instance from './axios';
import "./Row.css";


const base_url ="https://image.tmdb.org/t/p/original"
function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {

        // a snippet of code which runs based on specific condition
        async function fetchData() {
            const request = await instance.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();

        //if [] then loads only once 
        //if [fetchUrl] then useEffect run again when fetchUrl changes 
    }, [fetchUrl]);

    console.table(movies);

    const opts = {
        height:"390",
        width:"100%",
        playerVars:{
            autoplay:1,
        },
    };

    const handleClick = (movie) =>{
        if(trailerUrl){
            setTrailerUrl('');

        }else{
            movieTrailer(movie?.name || "" )
            .then(url=>{
                const urlParms=new URLSearchParams( new URL(url).search);
                setTrailerUrl(urlParms.get('v'));
            })
            .catch((error)=> console.log(error));
        }
    };


    return (
        <div className='row'>
            <h2>{title}</h2>
            <div className='row__posters'>

                {movies.map(movie => (
                    <img 
                    key={movie.id}
                    onClick={()=> handleClick(movie)}
                    className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                    src={`${base_url}${isLargeRow ? movie.poster_path:movie.backdrop_path}`} 
                    alt={movie.name} />
                ))}
            </div>
           {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}/>}
        </div>
    );
}

export default Row;
