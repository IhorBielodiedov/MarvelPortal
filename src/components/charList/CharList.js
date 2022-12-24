import './charList.scss';
import { useState, useEffect, useRef } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import {CSSTransition, TransitionGroup} from 'react-transition-group';

const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
            break;
        case 'confirmed':
            return <Component/>;
            break;
        case 'error':
            return <ErrorMessage/>
            break;
        default:
            throw new Error('Unexpected process state');
        
    }
}

const CharList = (props) => {

    const [char, setChar] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters, process, setProcess} = MarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest   = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset).then(onCharLoaded).then(() => setProcess('confirmed'));
    }

    const onCharLoaded = (newChar) => {
        let ended = false;
        if(newChar.length < 9){
            ended = true;
        }
        setChar(char => [...char, ...newChar]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(elem => elem.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems (char) {
        const elements = char.map((element, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (element.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
            <CSSTransition key={element.id} timeout={500} classNames="char__item">
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(element.id)
                        focusOnItem(i);
                    }}
                    onKeyPress={(e)=>{
                        if(e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(element.id);
                            focusOnItem(i);
                        }
                    }}
                    >
                    <img src={element.thumbnail} alt="abyss" style={imgStyle}/>
                    <div className="char__name">{element.name}</div>
                </li>
            </CSSTransition>
            )
        })
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {elements}
                </TransitionGroup>
            </ul>
        )
    }

        return (
            <div className="char__list">
                {setContent(process, () => renderItems(char), newItemLoading)}
                <button className="button button__main button__long"
                        disabled={newItemLoading}
                        style={{'display': charEnded ? 'none' : 'block'}}
                        onClick={()=> onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

export default CharList;