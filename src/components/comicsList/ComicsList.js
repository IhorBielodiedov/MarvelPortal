import "./comicsList.scss";

import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/errorMessage";

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case "waiting":
      return <Spinner />;
      break;
    case "loading":
      return newItemLoading ? <Component /> : <Spinner />;
      break;
    case "confirmed":
      return <Component />;
      break;
    case "error":
      return <ErrorMessage />;
      break;
    default:
      throw new Error("Unexpected process state");
  }
};

const ComicsList = (props) => {
  const [comics, setComics] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { getAllComics, process, setProcess } = MarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
      .then(onComicsLoaded)
      .then(() => setProcess("confirmed"));
  };

  const onComicsLoaded = (newComics) => {
    let ended = false;
    if (newComics.length < 8) {
      ended = true;
    }
    setComics((comics) => [...comics, ...newComics]);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 8);
    setComicsEnded((comicsEnded) => ended);
  };

  const itemRefs = useRef([]);

  function renderItems(comics) {
    const elements = comics.map((element, i) => {
      return (
        <li className="comics__item" key={i}>
          <Link to={`/comics/${element.id}`}>
            <img
              src={element.thumbnail}
              alt="ultimate war"
              className="comics__item-img"
            />
            <div className="comics__item-name">{element.title}</div>
            <div className="comics__item-price">{element.prices}</div>
          </Link>
        </li>
      );
    });
    return <ul className="comics__grid">{elements}</ul>;
  }

  const elements = useMemo(() => {
    return setContent(process, () => renderItems(comics), newItemLoading);
    // eslint-disable-next-line
  }, [process]);

  return (
    <div className="comics__list">
      {elements}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
