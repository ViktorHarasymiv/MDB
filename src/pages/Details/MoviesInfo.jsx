import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";

import { format } from "date-fns";

import { fetchDetails } from "./../../movieApi";

import css from "./Details.module.css";
import clsx from "clsx";

import { MdAccessTime } from "react-icons/md";
import { FaRegCalendar } from "react-icons/fa";

import { RiExternalLinkFill } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";
import { FaRegStarHalf } from "react-icons/fa";

export default function MoviesInfo() {
  const location = useLocation();

  const [details, setDetails] = useState([]);
  const [genres, setGenres] = useState([]);
  const [companies, setCompanies] = useState([]);

  const IMAGE_SRC = `https://image.tmdb.org/t/p/w500/${details.poster_path}`;

  const { id } = useParams();

  useEffect(() => {
    const FETCH = async () => {
      try {
        const DETAILS_DATA = await fetchDetails(id);
        setDetails(DETAILS_DATA);
        setGenres(DETAILS_DATA.genres);
        setCompanies(DETAILS_DATA.production_companies);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    FETCH();
  }, [id]);

  const rating = Number(details.vote_average).toFixed(2);

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date))) {
      return "Unknown date";
    }
    return format(new Date(date), "MMMM dd yyyy");
  };

  function convertMinutesToHours(minutes) {
    const hours = Math.floor(minutes / 60); // Цілі години
    const remainingMinutes = minutes % 60; // Залишок хвилин
    return `${hours} h ${remainingMinutes} min`;
  }

  const buildLinkClass = (to) => {
    return clsx(
      css.tile_link,
      location.pathname === to && css.tile_link_active
    );
  };

  return (
    <div className={css.movies_tile}>
      <img className={css.tile_image} src={IMAGE_SRC} alt="" />
      <div className={css.about_tile}>
        <a
          className={css.title_link_tile}
          href={details.homepage}
          target="_blank"
        >
          <h3 className={css.title_tile}>
            {details.original_title}
            <RiExternalLinkFill className={css.link_ico} />
          </h3>
        </a>
        <h4 className={css.subtitle_tile}>{details.tagline}</h4>
        <p className={css.overview}>{details.overview}</p>
        <div className={css.details_movie_value}>
          <span className={css.movie_value}>
            {rating >= 6 ? (
              <FaRegStar style={{ fill: "orange", marginRight: "6px" }} />
            ) : (
              <FaRegStarHalf style={{ fill: "orange", marginRight: "6px" }} />
            )}
            <span className={css.rating}>{rating}</span>
          </span>
          <span className={css.movie_value}>
            <FaRegCalendar
              style={{
                fill: "orange",
                fontSize: "14px",
                marginRight: "10px",
              }}
            />
            {formatDate(details.release_date)}
          </span>
          <span className={css.movie_value}>
            <MdAccessTime
              style={{
                fill: "orange",
                fontSize: "16px",
                marginRight: "6px",
              }}
            />
            {convertMinutesToHours(details.runtime)}
          </span>
        </div>
        <ul className={css.details_tile}>
          {genres.map((item, index) => (
            <li key={index} className={css.genres_tile}>
              {item.name}
            </li>
          ))}
        </ul>
        <div className={css.company_box}>
          <ul className={css.company}>
            {companies.map((item, index) => (
              <li key={index} className={css.mySlide}>
                <div className={css.company_tile}>
                  {item.logo_path ? (
                    <img
                      className={css.company_ico}
                      src={"https://image.tmdb.org/t/p/w500/" + item.logo_path}
                      alt=""
                    />
                  ) : (
                    <span className={css.company_name}>{item.name}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <nav className={css.tile_nav}>
          <NavLink
            to={"cast"}
            state={location.state}
            className={buildLinkClass(`/movies/${id}/cast`)}
          >
            Cast
          </NavLink>
          <NavLink
            to={"reviews"}
            state={location.state}
            className={buildLinkClass(`/movies/${id}/reviews`)}
          >
            Reviews
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}
