import './comicsList.scss';

import { useState, useEffect, useRef } from 'react';
import {Link} from 'react-router-dom';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

const ComicsList = (props) => {

    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = MarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest   = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset).then(onComicsLoaded);
    }

    const onComicsLoaded = (newComics) => {
        let ended = false;
        if(newComics.length < 8){
            ended = true;
        }
        setComics(comics => [...comics, ...newComics]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    const itemRefs = useRef([]);

    function renderItems(comics) {
        const elements = comics.map((element, i) => {
            return (
                <li className="comics__item" key={i}>
                        <Link to={`/comics/${element.id}`}>
                            <img src={element.thumbnail} alt="ultimate war" className="comics__item-img"/>
                            <div className="comics__item-name">{element.title}</div>
                            <div className="comics__item-price">{element.prices}</div>
                        </Link>
                    </li>
            )
        })
        return (
            <ul className="comics__grid">
                {elements}
            </ul>
        )
    }

    const items = renderItems(comics);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long" disabled={newItemLoading}
                        style={{'display': comicsEnded ? 'none' : 'block'}}
                        onClick={()=> onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;