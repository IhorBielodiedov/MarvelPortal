import './charList.scss';
import { useState, useEffect, useRef } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';

const CharList = (props) => {

    const [char, setChar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, [])

    const onRequest   = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset).then(onCharLoaded).catch(onError);
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }
    updateChar = () => {
        this.setState({loading: true})
        this.marvelService.getAllCharacters().then(this.onCharLoaded).catch(this.onError);
    }

    const onCharLoaded = (newChar) => {
        let ended = false;
        if(newChar.length < 9){
            ended = true;
        }
        setChar(char => [...char, ...newChar]);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onError = () => {
        this.setState({error: true, loading: false})
        setError(error => true);

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
            <li 
                className="char__item"
                tabIndex={0}
                ref={el => itemRefs.current[i] = el}
                key={element.id}
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
            )
        })
        return (
            <ul className="char__grid">
                {elements}
            </ul>
        )
    }

        const items = renderItems(char);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                
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